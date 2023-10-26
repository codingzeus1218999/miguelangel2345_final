import { useContext, useEffect } from "react";
import Layout from "../../components/layout";
import { NavContext } from "../../context/NavContext";

export default function Stream() {
  const { setNav } = useContext(NavContext);
  useEffect(() => {
    setNav("stream");
  }, [setNav]);
  return (
    <Layout>
      <h1 className="page-title">Stream</h1>
    </Layout>
  );
}
