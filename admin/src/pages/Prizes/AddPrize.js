import { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Field, Formik, Form } from "formik";
import * as Yup from "yup";
import { MetroSpinner } from "react-spinners-kit";

import Layout from "../../components/layout";
import Button from "../../components/ui/Button";
import TextInput from "../../components/ui/TextInput";
import TextArea from "../../components/ui/TextArea";
import NumberInput from "../../components/ui/NumberInput";
import SwitchField from "../../components/ui/SwitchField";
import SelectField from "../../components/ui/SelectField";

import { NavContext } from "../../context/NavContext";

import DefaultItemImage from "../../assets/images/money.jfif";
import { NotificationManager } from "react-notifications";
import { addPrize } from "../../utils/api";

export default function AddPrize() {
  const { setNav } = useContext(NavContext);
  const [selectedImage, setSelectedImage] = useState(null);
  const [displayImage, setDisplayImage] = useState(DefaultItemImage);
  const [componentState, setComponentState] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    setNav("prizes");
  }, [setNav]);

  const onImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
    setComponentState("set");
    let reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
      setDisplayImage(reader.result);
    };
    reader.onerror = (err) => {
      NotificationManager.error(err);
    };
  };

  const onImageRemove = () => {
    setSelectedImage(null);
    setDisplayImage(DefaultItemImage);
    setComponentState("");
  };

  return (
    <Layout>
      <h1 className="page-title">Add Prize</h1>
      <Link to="/prizes" className="mt-6 block w-fit">
        <Button>back to list</Button>
      </Link>
      <div className="mt-6">
        <Formik
          initialValues={{
            image: null,
            name: "",
            description: "",
            points: 0,
            shouldModerator: false,
            isLocked: false,
            wagerMethod: "",
            wagerMin: 0,
            wagerMax: 1,
          }}
          validationSchema={Yup.object().shape({
            name: Yup.string().required("This field is required"),
            description: Yup.string().required("This field is required"),
            points: Yup.number()
              .min(0, "Minimum value is 0")
              .required("This field is required"),
            wagerMethod: Yup.string().oneOf(
              ["", "Weekly", "Monthly"],
              "This filed should be one of 'Weekly' and 'Monthly'"
            ),
            wagerMin: Yup.number()
              .min(0, "Minimum value is 0")
              .lessThan(
                Yup.ref("wagerMax"),
                "This field should be less than wagerMax"
              )
              .required("This field is required"),
            wagerMax: Yup.number()
              .min(1, "Minimum value is 1")
              .moreThan(
                Yup.ref("wagerMin"),
                "This field should be greater than wagerMin"
              )
              .required("This field is required"),
          })}
          onSubmit={async (values, actions) => {
            const formData = new FormData();
            formData.append("image", selectedImage);
            formData.append("info", JSON.stringify(values));
            try {
              const res = await addPrize(formData);
              actions.setSubmitting(false);
              if (res.success) {
                NotificationManager.success("New prize was added successfuly");
                setDisplayImage(DefaultItemImage);
                setComponentState("");
                setSelectedImage(null);
                actions.resetForm();
              }
            } catch (err) {
              NotificationManager.error("Something is wrong, please try again");
              actions.setSubmitting(false);
            }
          }}
        >
          {({ isValid, isSubmitting }) => (
            <Form>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <div>
                    <div className="flex flex-col justify-center gap-6 items-center">
                      <img
                        alt="prize"
                        src={displayImage}
                        className="cursor-pointer hover:opacity-80 hover:filter transition-all rounded-md w-72 max-w-full"
                        onClick={() => fileInputRef.current.click()}
                      />
                      <Button
                        onClick={() => onImageRemove()}
                        disabled={componentState === ""}
                      >
                        Remove
                      </Button>
                    </div>
                    <input
                      type="file"
                      onChange={onImageChange}
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                    />
                  </div>
                </div>
                <div>
                  <Field name="name" component={TextInput} placeholder="name" />
                  <Field
                    className="mt-6"
                    name="points"
                    component={NumberInput}
                    placeholder="points"
                  />
                  <Field
                    name="description"
                    component={TextArea}
                    rows={6}
                    placeholder="description"
                    className="mt-6"
                  />
                </div>
                <div>
                  <Field
                    name="shouldModerator"
                    component={SwitchField}
                    placeholder="Should be a moderator ?: "
                  />
                  <Field
                    name="isLocked"
                    component={SwitchField}
                    placeholder="Locked ?: "
                    className="mt-6"
                  />
                  <Field
                    name="wagerMethod"
                    className="mt-6"
                    component={SelectField}
                    placeholder="wager method"
                    options={[
                      { label: "", value: "" },
                      { label: "Weekly", value: "Weekly" },
                      { label: "Monthly", value: "Monthly" },
                    ]}
                  />
                  <Field
                    name="wagerMin"
                    component={NumberInput}
                    placeholder="wager min value"
                    className="mt-6"
                  />
                  <Field
                    name="wagerMax"
                    component={NumberInput}
                    placeholder="wager max value"
                    className="mt-6"
                  />
                  <Button
                    type="submit"
                    disabled={!isValid || isSubmitting}
                    className="mt-6 float-right"
                  >
                    {isSubmitting ? (
                      <div className="mx-auto w-fit">
                        <MetroSpinner color="#000000" size="25" />
                      </div>
                    ) : (
                      "Save"
                    )}
                  </Button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Layout>
  );
}
