import { useContext, useEffect } from "react";
import Layout from "../../components/layout";
import { NavContext } from "../../context/NavContext";

export default function CookiePolicy() {
  const { setNav } = useContext(NavContext);
  useEffect(() => {
    setNav("cookie-policy");
  }, [setNav]);

  return (
    <Layout>
      <h1 className="page-title">CookiePolicy</h1>
    </Layout>
  );
}
