import { useRef, useState } from "react";
import Avatar from "react-avatar";
import { NotificationManager } from "react-notifications";

import { Button } from "../index";

import { AvatarDefault } from "../../../assets/images";

import { removeUserAvatar, uploadUserAvatar } from "../../../apis";
import constants from "../../../constants";

export default function AvatarUpload({ email, avatar }) {
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [displayAvatar, setDisplayAvatar] = useState(
    avatar ? `${constants.AVATAR_DIR}/${avatar}` : AvatarDefault
  );
  const [componentState, setComponentState] = useState(
    avatar ? "old" : "empty"
  );
  const [thisAvatar, setThisAvatar] = useState(avatar);
  const fileInputRef = useRef(null);

  const onAvatarRemove = () => {
    setSelectedAvatar(null);
    setDisplayAvatar(AvatarDefault);
    setComponentState(thisAvatar ? "removed" : "empty");
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
  const onAvatarUpload = async () => {
    if (componentState === "removed") {
      try {
        const res = await removeUserAvatar({ email });
        setThisAvatar(res.avatar);
        setComponentState("empty");
        NotificationManager.success("Removed avatar successfuly");
      } catch (err) {
        NotificationManager.error("Something is wrong, please try again.");
      }
    } else {
      const formData = new FormData();
      formData.append("avatar", selectedAvatar);
      formData.append("email", email);
      try {
        const res = await uploadUserAvatar(formData);
        setThisAvatar(res.avatar);
        setComponentState("old");
        NotificationManager.success("Changed avatar successfuly");
      } catch (err) {
        NotificationManager.error("Something is wrong, please try again.");
      }
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
