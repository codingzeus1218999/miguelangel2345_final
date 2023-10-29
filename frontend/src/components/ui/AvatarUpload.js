import { useContext, useRef, useState } from "react";
import Avatar from "react-avatar";

import Button from "../ui/Button";

import DefaultAvatarImage from "../../assets/images/avatar.jpg";

import { UserContext } from "../../context/UserContext";
import { NotificationManager } from "react-notifications";
import { removeAvatar, uploadAvatar } from "../../apis";
import constants from "../../constants";

export default function AvatarUpload() {
  const { account, setAccount } = useContext(UserContext);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [displayAvatar, setDisplayAvatar] = useState(
    account.avatar
      ? `${constants.AVATAR_DIR}/${account.avatar}`
      : DefaultAvatarImage
  );
  const [componentState, setComponentState] = useState(
    account.avatar ? "old" : "empty"
  );
  const fileInputRef = useRef(null);

  const onAvatarRemove = () => {
    setSelectedAvatar(null);
    setDisplayAvatar(DefaultAvatarImage);
    setComponentState(account.avatar ? "removed" : "empty");
  };
  const onAvatarChange = (e) => {
    setSelectedAvatar(e.target.files[0]);
    setComponentState("new");
    let reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
      setDisplayAvatar(reader.result);
    };
    reader.onerror = (err) => {
      NotificationManager.error(err);
    };
  };
  const onAvatarUpload = () => {
    if (componentState === "removed") {
      removeAvatar(
        { email: account.email },
        (res) => {
          setAccount({ ...account, avatar: "" });
          setComponentState("empty");
          NotificationManager.success("Avatar has been changed successfully.");
        },
        (err) => {
          err.response.data.success === false
            ? NotificationManager.error(err.response.data.message)
            : NotificationManager.error(
                "Something is wrong, please try again."
              );
        }
      );
    } else {
      const formData = new FormData();
      formData.append("avatar", selectedAvatar);
      formData.append("email", account.email);
      uploadAvatar(
        formData,
        (res) => {
          setComponentState("old");
          setAccount({ ...account, avatar: res.data.avatar });
          NotificationManager.success("Avatar has been changed successfully.");
        },
        (err) => {
          err.response.data.success === false
            ? NotificationManager.error(err.response.data.message)
            : NotificationManager.error(
                "Something is wrong, please try again."
              );
        }
      );
    }
  };

  return (
    <div>
      <div className="flex flex-row justify-center">
        <Avatar
          size="100"
          round={true}
          src={displayAvatar}
          className="cursor-pointer hover:opacity-80 hover:filter transition-all"
          onClick={() => fileInputRef.current.click()}
        />
      </div>
      <input
        type="file"
        onChange={onAvatarChange}
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
      />
      <div className="mt-3 grid grid-cols-2 gap-2">
        <Button
          onClick={() => onAvatarRemove()}
          className="mt-3 w-full"
          disabled={componentState === "empty" || componentState === "removed"}
        >
          Remove
        </Button>
        <Button
          onClick={() => onAvatarUpload()}
          className="mt-3 w-full"
          disabled={componentState === "old" || componentState === "empty"}
        >
          Save
        </Button>
      </div>
    </div>
  );
}
