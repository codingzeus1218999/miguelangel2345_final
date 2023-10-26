import { useContext, useEffect } from "react";
import Layout from "../../components/layout";
import { NavContext } from "../../context/NavContext";

export default function PrivacyPolicy() {
  const { setNav } = useContext(NavContext);
  useEffect(() => {
    setNav("privacy-policy");
  }, [setNav]);
  return (
    <Layout>
      <h1 className="page-title">PrivacyPolicy</h1>
    </Layout>
  );
}
