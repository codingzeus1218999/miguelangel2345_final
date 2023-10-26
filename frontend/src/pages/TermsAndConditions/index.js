import { useContext, useEffect } from "react";
import Layout from "../../components/layout";
import { NavContext } from "../../context/NavContext";

export default function TermsAndConditions() {
  const { setNav } = useContext(NavContext);
  useEffect(() => {
    setNav("terms-and-conditions");
  }, [setNav]);
  return (
    <Layout>
      <h1 className="page-title">TermsAndConditions</h1>
    </Layout>
  );
}
