import { FC } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQueryClient, useMutation, useQuery } from "react-query";
import axios from "axios";
import { Formik, Field, Form, FormikHelpers, FormikProps } from "formik";
import * as yup from "yup";
import { useTranslation } from "react-i18next";

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
}

const validationSchema = yup.object().shape({
  name: yup.string().required("Please, write name"),
  price: yup.number().required("Please, write price"),
  description: yup.string().required("Please, write description"),
});

const EditProduct: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: initialProduct,
    isLoading,
    isError,
  } = useQuery<Product>(
    ["product", id],
    async () => {
      const response = await axios.get<Product>(
        `http://localhost:3001/products/${id}`
      );
      return response.data;
    },
    { enabled: !!id }
  );

  const updateProduct = async (updatedProduct: Product) => {
    const response = await axios.put<Product>(
      `http://localhost:3001/product-update/${id}`, // Исправленный URL
      updatedProduct
    );
    return response.data;
  };

  const mutation = useMutation(updateProduct, {
    onSuccess: async () => {
      await queryClient.invalidateQueries("products");
      navigate("/product-list");
    },
    onError: (error) => {
      console.error("Error updating product:", error);
    },
  });

  const onSubmit = async (
    values: Product,
    { setSubmitting }: FormikHelpers<Product>
  ) => {
    mutation.mutate(values);
    setSubmitting(false);
  };

  const { t, i18n } = useTranslation();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const changeLanguage = (language: string | undefined) => {
    i18n.changeLanguage(language);
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching product</div>;

  return (
    <Formik
      initialValues={initialProduct!}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ errors, touched }: FormikProps<Product>) => (
        <Form>
          <h1>Edit Product</h1>
          <div className="row">
            <div className="group">
              <label>{t("name")}</label>
              <Field name="name" className="standart" />
              {errors.name && touched.name && <div>{errors.name}</div>}
            </div>
            <div className="group">
              <label>{t("price")}</label>
              <Field name="price" type="number" className="standart" />
              {errors.price && touched.price && <div>{errors.price}</div>}
            </div>
          </div>
          <div className="big-input">
            <label>{t("description")}</label>
            <Field name="description" className="big" />
            {errors.description && touched.description && (
              <div>{errors.description}</div>
            )}
          </div>
          <button className="blue-button" type="submit">
            {t("save-product")}
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default EditProduct;
