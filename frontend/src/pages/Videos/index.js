import { useContext, useEffect } from "react";
import Layout from "../../components/layout";
import { NavContext } from "../../context/NavContext";

export default function Videos() {
  const { setNav } = useContext(NavContext);
  useEffect(() => {
    setNav("videos");
  }, [setNav]);
  return (
    <Layout>
      <h1 className="page-title">Videos</h1>
    </Layout>
  );
}
