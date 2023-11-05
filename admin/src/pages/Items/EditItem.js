import { useContext, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { NotificationManager } from "react-notifications";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { MetroSpinner } from "react-spinners-kit";

import Layout from "../../components/layout";
import {
  AddMultiValues,
  Button,
  Check,
  ElementLoadingSpinner,
  NumberInput,
  TextArea,
  TextInput,
  TypeRadio,
} from "../../components/ui";
import {
  getItemInfoById,
  editItem,
  getItemRaffleByItem,
  createItemRaffle,
} from "../../apis";
import { NavContext } from "../../context/NavContext";
import { ProductDefault } from "../../assets/images";
import constants from "../../constants";
import { ItemRaffleWinner } from "../../components/form";

export default function EditItem() {
  const { setNav } = useContext(NavContext);
  const { id } = useParams();
  const [itemInfo, setItemInfo] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [displayImage, setDisplayImage] = useState(ProductDefault);
  const [componentState, setComponentState] = useState("");
  const [raffleInfo, setRaffleInfo] = useState({});
  const fileInputRef = useRef(null);
  const [itemType, setItemType] = useState("redeem");

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

  const onImageRemove = (callback) => {
    setSelectedImage(null);
    setDisplayImage(ProductDefault);
    setComponentState("");
    callback();
  };

  useEffect(() => {
    setNav("items");
    const fetchItemInfo = async () => {
      try {
        const res = await getItemInfoById(id);
        if (res.success) {
          setItemInfo(res.data.item);
          if (res.data.item.image) {
            setDisplayImage(`${constants.ITEM_DIR}/${res.data.item.image}`);
            setComponentState("set");
          }
          setItemType(res.data.item.type);
        } else {
          NotificationManager.error(res.message);
        }
      } catch (err) {
        console.log(err);
        NotificationManager.error(
          "Something was wrong in connection with server"
        );
      }
    };
    fetchItemInfo();
    const fetchItemRaffleInfo = async () => {
      try {
        const res = await getItemRaffleByItem(id, "pending");
        if (res.success) {
          setRaffleInfo(res.data?.itemRaffle);
        } else {
          NotificationManager.error(res.message);
        }
      } catch (err) {
        console.log(err);
        NotificationManager.error(
          "Something was wrong in connection with server"
        );
      }
    };
    fetchItemRaffleInfo();
  }, [id, setNav]);

  const onClickCreateItemRaffle = async () => {
    try {
      const res = await createItemRaffle(id);
      if (res.success) {
        NotificationManager.success(res.message);
        setRaffleInfo(res.data?.raffleInfo);
      } else {
        NotificationManager.error(res.message);
      }
    } catch (err) {
      console.log(err);
      NotificationManager.error(
        "Something was wrong in connection with server"
      );
    }
  };

  return (
    <Layout>
      <div className="flex justify-between items-center">
        <h1 className="page-title">Edit Item</h1>
        <Link to="/items" className="block w-fit">
          <Button>back to list</Button>
        </Link>
      </div>
      <div className="mt-6">
        {Object.keys(itemInfo).length > 0 ? (
          <Formik
            initialValues={{
              type: itemInfo.type,
              name: itemInfo.name,
              description: itemInfo.description,
              cost: itemInfo.cost,
              quantity: itemInfo.quantity,
              coolDownGlobal: itemInfo.coolDownGlobal,
              coolDownUser: itemInfo.coolDownUser,
              image: itemInfo.image,
              isNoticeInChat: itemInfo.isNoticeInChat,
              shouldBeSubscriber: itemInfo.shouldBeSubscriber,
              requirements: itemInfo.requirements,
              codes: itemInfo.codes,
              shouldDiscard: itemInfo.shouldDiscard,
              selectRandom: itemInfo.selectRandom,
            }}
            validationSchema={Yup.object().shape({
              type: Yup.string()
                .oneOf(["redeem", "key", "raffle"])
                .required("This field is required"),
              name: Yup.string().required("This field is required"),
              cost: Yup.number()
                .min(0, "Minimum cost is 0")
                .required("This field is required"),
              quantity: Yup.number()
                .min(-1, "Minimum quantity is -1")
                .required("This field is required"),
              coolDownGlobal: Yup.number()
                .min(0, "Minimum cooldown is 0")
                .required("This field is required"),
              coolDownUser: Yup.number()
                .min(0, "Minimum cooldown is 0")
                .required("This field is required"),
              isNoticeInChat: Yup.boolean(),
              shouldBeSubscriber: Yup.boolean(),
              shouldDiscard: Yup.boolean(),
              selectRandom: Yup.boolean(),
            })}
            onSubmit={async (values, actions) => {
              const formData = new FormData();
              formData.append("image", selectedImage);
              formData.append("info", JSON.stringify(values));
              formData.append("id", itemInfo._id);
              try {
                const res = await editItem(formData);
                if (res.success) {
                  NotificationManager.success(res.message);
                } else {
                  NotificationManager.error(res.message);
                }
              } catch (err) {
                console.log(err);
                NotificationManager.error(
                  "Something is wrong, please try again"
                );
              } finally {
                actions.setSubmitting(false);
              }
            }}
          >
            {({ isValid, isSubmitting }) => (
              <Form>
                <Field
                  name="type"
                  placeholder="Item type"
                  component={TypeRadio}
                  items={[
                    {
                      value: "redeem",
                      title: "Redeem item with custom fields",
                    },
                    { value: "key", title: "Random key list" },
                    { value: "raffle", title: "Raffle item" },
                  ]}
                  onClickItem={(v) => {
                    setItemType(v);
                  }}
                />
                <div className="grid md:grid-cols-3 gap-10 mt-6">
                  <div className="flex flex-col gap-6">
                    <div>
                      <div className="flex flex-col justify-center gap-3 items-center w-full">
                        <img
                          alt="item"
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
                    <Field
                      name="name"
                      component={TextInput}
                      placeholder="name"
                    />
                  </div>
                  <div className="flex flex-col gap-6">
                    <Field
                      name="cost"
                      component={NumberInput}
                      placeholder="cost"
                    />
                    {(itemType === "redeem" || itemType === "raffle") && (
                      <Field
                        name="quantity"
                        component={NumberInput}
                        placeholder="quantity"
                        min={-1}
                      />
                    )}
                    <Field
                      name="coolDownGlobal"
                      component={NumberInput}
                      placeholder="global cooldown second"
                    />
                    <Field
                      name="coolDownUser"
                      component={NumberInput}
                      placeholder="user cooldown seconds"
                    />
                    {itemType === "key" && (
                      <Field
                        name="codes"
                        component={AddMultiValues}
                        placeholder="List of access codes"
                        title="Add code"
                      />
                    )}
                  </div>
                  <div className="flex flex-col gap-6">
                    <Field
                      name="description"
                      component={TextArea}
                      rows={6}
                      placeholder="description"
                    />
                    {itemType === "redeem" && (
                      <Field
                        name="requirements"
                        component={AddMultiValues}
                        placeholder="Additional Requirements"
                        title="Add requirement"
                      />
                    )}
                    <Field
                      name="isNoticeInChat"
                      component={Check}
                      title="Send confirmation when redeeming via chat"
                    />
                    <Field
                      name="shouldBeSubscriber"
                      component={Check}
                      title="Subscriber only"
                    />
                    {itemType === "key" && (
                      <Field
                        name="shouldDiscard"
                        component={Check}
                        title="Once a key has been given out, do not give it out again"
                      />
                    )}
                    {itemType === "key" && (
                      <Field
                        name="selectRandom"
                        component={Check}
                        title="Dispense keys randomly"
                      />
                    )}
                  </div>
                </div>
                <div className="mt-6 flex flex-row justify-end">
                  <Button type="submit" disabled={!isValid || isSubmitting}>
                    {isSubmitting ? (
                      <div className="mx-auto w-fit">
                        <MetroSpinner color="#000000" size={25} />
                      </div>
                    ) : (
                      "Save"
                    )}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        ) : (
          <div className="flex flex-row justify-center items-center my-20">
            <ElementLoadingSpinner />
          </div>
        )}
      </div>
      {itemType === "raffle" && (
        <div className="mt-6">
          {raffleInfo && Object.keys(raffleInfo).length > 0 ? (
            <div className="w-full md:w-2/3">
              <ItemRaffleWinner
                raffle={raffleInfo}
                callback={() => setRaffleInfo({})}
              />
            </div>
          ) : (
            <div>
              <Button onClick={() => onClickCreateItemRaffle()}>
                Create Raffle
              </Button>
            </div>
          )}
        </div>
      )}
    </Layout>
  );
}
