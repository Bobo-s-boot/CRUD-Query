import { Formik, Field, Form, FormikHelpers, FormikProps } from "formik";
import { FC } from "react";
import * as yup from "yup";
import { useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";

interface ProductFormValues {
  name: string;
  price: number;
  description: string;
}

const validationSchema = yup.object().shape({
  name: yup.string().required("Please, write name"),
  price: yup.number().required("Please, write price"),
  description: yup.string().required("Please, write description"),
});

const AddProduct: FC = () => {
  const initialValues: ProductFormValues = {
    name: "",
    price: 0,
    description: "",
  };

  const history = useNavigate();
  const queryClient = useQueryClient();

  const createProduct = async (product: ProductFormValues) => {
    const response = await axios.post(
      "http://localhost:3001/product-create",
      product
    );
    return response.data;
  };

  const mutation = useMutation(createProduct, {
    onSuccess: () => {
      queryClient.invalidateQueries("products");
      history("/alert");
    },
    onError: (error) => {
      console.error("Error creating product:", error);
    },
  });

  const onSubmit = (
    values: ProductFormValues,
    { setSubmitting }: FormikHelpers<ProductFormValues>
  ) => {
    mutation.mutate(values);
    setSubmitting(false);
  };

  const { t, i18n } = useTranslation();

  const changeLanguage = (language: string | undefined) => {
    i18n.changeLanguage(language);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ errors, touched }: FormikProps<ProductFormValues>) => (
        <Form>
          <h1>{t("info")}</h1>

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
            {t("create-product")}
          </button>

          <div className="group-buttons">
            <button onClick={() => changeLanguage("en")}>EN</button>
            <button onClick={() => changeLanguage("ua")}>UA</button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default AddProduct;
