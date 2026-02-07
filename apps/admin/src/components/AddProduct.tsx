"use client";

import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";
import { ScrollArea } from "./ui/scroll-area";
import { CategoryType, colors, ProductFormSchema, sizes } from "@repo/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useAuth } from "@clerk/nextjs";
import { Loader2 } from "lucide-react"; // ✅ Para loading spinner

// ✅ Función de fetch mejorada con manejo de errores
const fetchCategories = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL}/categories`,
  );

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to fetch categories!");
  }

  return await res.json();
};

const AddProduct = () => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient(); // ✅ Para invalidar queries después de crear

  const form = useForm<z.infer<typeof ProductFormSchema>>({
    resolver: zodResolver(ProductFormSchema),
    defaultValues: {
      name: "",
      shortDescription: "",
      description: "",
      price: 0,
      categorySlug: "",
      sizes: [],
      colors: [],
      images: {},
    },
  });

  // ✅ Query con mejor manejo de estados
  const {
    isPending: isLoadingCategories,
    error: categoriesError,
    data: categories,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 5 * 60 * 1000, // ✅ Cache por 5 minutos
    retry: 2, // ✅ Reintentar 2 veces si falla
  });

  // ✅ Mutation mejorada con reset del formulario
  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof ProductFormSchema>) => {
      const token = await getToken();

      if (!token) {
        throw new Error("Authentication required");
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL}/products`,
        {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to create product!");
      }

      return res.json();
    },
    onSuccess: (data) => {
      toast.success("Product created successfully!");
      form.reset(); // ✅ Resetear formulario después de éxito
      queryClient.invalidateQueries({ queryKey: ["products"] }); // ✅ Refrescar lista de productos
    },
    onError: (error: Error) => {
      toast.error(error.message || "An error occurred");
      console.error("Product creation error:", error);
    },
  });

  // ✅ Manejo de estado de carga de categorías
  if (isLoadingCategories) {
    return (
      <SheetContent>
        <div className="flex items-center justify-center h-full">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="ml-2">Loading categories...</span>
        </div>
      </SheetContent>
    );
  }

  // ✅ Manejo de error al cargar categorías
  if (categoriesError) {
    return (
      <SheetContent>
        <div className="flex flex-col items-center justify-center h-full gap-4">
          <p className="text-red-600">Failed to load categories</p>
          <Button
            onClick={() =>
              queryClient.invalidateQueries({ queryKey: ["categories"] })
            }
          >
            Retry
          </Button>
        </div>
      </SheetContent>
    );
  }

  return (
    <SheetContent>
      <ScrollArea className="h-screen pb-10">
        <SheetHeader>
          <SheetTitle className="mb-4">Add Product</SheetTitle>
          <SheetDescription asChild>
            <Form {...form}>
              <form
                className="space-y-8"
                onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
              >
                {/* NAME FIELD */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Product name" />
                      </FormControl>
                      <FormDescription>
                        Enter the name of the product.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* SHORT DESCRIPTION FIELD */}
                <FormField
                  control={form.control}
                  name="shortDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Short Description</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Brief description" />
                      </FormControl>
                      <FormDescription>
                        Enter a short description (max 100 chars).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* DESCRIPTION FIELD */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Detailed product description"
                          rows={4}
                        />
                      </FormControl>
                      <FormDescription>
                        Enter the full description of the product.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* PRICE FIELD */}
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price ($)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        Enter the price of the product.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* CATEGORY FIELD */}
                <FormField
                  control={form.control}
                  name="categorySlug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={!categories || categories.length === 0}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories?.map((cat: CategoryType) => (
                              <SelectItem key={cat.id} value={cat.slug}>
                                {cat.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormDescription>
                        Select the product category.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* SIZES FIELD */}
                <FormField
                  control={form.control}
                  name="sizes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sizes</FormLabel>
                      <FormControl>
                        <div className="grid grid-cols-3 gap-4 my-2">
                          {sizes.map((size) => (
                            <div className="flex items-center gap-2" key={size}>
                              <Checkbox
                                id={`size-${size}`}
                                checked={field.value?.includes(size)}
                                onCheckedChange={(checked) => {
                                  const currentValues = field.value || [];
                                  if (checked) {
                                    field.onChange([...currentValues, size]);
                                  } else {
                                    field.onChange(
                                      currentValues.filter((v) => v !== size),
                                    );
                                  }
                                }}
                              />
                              <label
                                htmlFor={`size-${size}`}
                                className="text-xs cursor-pointer"
                              >
                                {size}
                              </label>
                            </div>
                          ))}
                        </div>
                      </FormControl>
                      <FormDescription>
                        Select the available sizes.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* COLORS FIELD */}
                <FormField
                  control={form.control}
                  name="colors"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Colors</FormLabel>
                      <FormControl>
                        <div className="grid grid-cols-3 gap-4 my-2">
                          {colors.map((color) => (
                            <div
                              className="flex items-center gap-2"
                              key={color}
                            >
                              <Checkbox
                                id={`color-${color}`}
                                checked={field.value?.includes(color)}
                                onCheckedChange={(checked) => {
                                  const currentValues = field.value || [];
                                  if (checked) {
                                    field.onChange([...currentValues, color]);
                                  } else {
                                    field.onChange(
                                      currentValues.filter((v) => v !== color),
                                    );
                                    // ✅ Limpiar imagen del color removido
                                    const currentImages =
                                      form.getValues("images");
                                    if (currentImages?.[color]) {
                                      const { [color]: removed, ...rest } =
                                        currentImages;
                                      form.setValue("images", rest);
                                    }
                                  }
                                }}
                              />
                              <label
                                htmlFor={`color-${color}`}
                                className="text-xs flex items-center gap-2 cursor-pointer"
                              >
                                <div
                                  className="w-3 h-3 rounded-full border"
                                  style={{ backgroundColor: color }}
                                />
                                {color}
                              </label>
                            </div>
                          ))}
                        </div>
                      </FormControl>
                      <FormDescription>
                        Select the available colors.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* IMAGES FIELD */}
                {form.watch("colors")?.length > 0 && (
                  <FormField
                    control={form.control}
                    name="images"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Images</FormLabel>
                        <FormDescription className="mb-4">
                          Upload one image for each selected color.
                        </FormDescription>
                        <FormControl>
                          <div className="space-y-3">
                            {form.watch("colors")?.map((color) => (
                              <div
                                className="flex items-center gap-4 p-3 border rounded-lg"
                                key={color}
                              >
                                <div className="flex items-center gap-2 min-w-[100px]">
                                  <div
                                    className="w-4 h-4 rounded-full border"
                                    style={{ backgroundColor: color }}
                                  />
                                  <span className="text-sm font-medium">
                                    {color}
                                  </span>
                                </div>
                                <Input
                                  type="file"
                                  accept="image/*"
                                  className="flex-1"
                                  onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;

                                    // ✅ Validar tamaño del archivo (max 5MB)
                                    if (file.size > 5 * 1024 * 1024) {
                                      toast.error(
                                        "Image must be less than 5MB",
                                      );
                                      return;
                                    }

                                    try {
                                      const formData = new FormData();
                                      formData.append("file", file);
                                      formData.append(
                                        "upload_preset",
                                        "ecommerce",
                                      );

                                      // ✅ Mostrar toast de carga
                                      const uploadToast =
                                        toast.loading("Uploading image...");

                                      const res = await fetch(
                                        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
                                        {
                                          method: "POST",
                                          body: formData,
                                        },
                                      );

                                      const data = await res.json();

                                      if (data.secure_url) {
                                        const currentImages =
                                          form.getValues("images") || {};
                                        form.setValue("images", {
                                          ...currentImages,
                                          [color]: data.secure_url,
                                        });
                                        toast.update(uploadToast, {
                                          render: "Image uploaded!",
                                          type: "success",
                                          isLoading: false,
                                          autoClose: 3000,
                                        });
                                      } else {
                                        throw new Error("Upload failed");
                                      }
                                    } catch (error) {
                                      console.error("Upload error:", error);
                                      toast.error("Upload failed!");
                                    }
                                  }}
                                />
                                {field.value?.[color] ? (
                                  <div className="flex items-center gap-2">
                                    <span className="text-green-600 text-sm">
                                      ✓ Uploaded
                                    </span>
                                    <img
                                      src={field.value[color]}
                                      alt={color}
                                      className="w-10 h-10 object-cover rounded border"
                                    />
                                  </div>
                                ) : (
                                  <span className="text-muted-foreground text-sm">
                                    Required
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* SUBMIT BUTTON */}
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    disabled={mutation.isPending}
                    className="flex-1"
                  >
                    {mutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Product"
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => form.reset()}
                    disabled={mutation.isPending}
                  >
                    Reset
                  </Button>
                </div>
              </form>
            </Form>
          </SheetDescription>
        </SheetHeader>
      </ScrollArea>
    </SheetContent>
  );
};

export default AddProduct;
