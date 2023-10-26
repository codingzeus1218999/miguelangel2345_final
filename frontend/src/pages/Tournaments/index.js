import { useContext, useEffect } from "react";
import Layout from "../../components/layout";
import { NavContext } from "../../context/NavContext";

export default function Tournaments() {
  const { setNav } = useContext(NavContext);
  useEffect(() => {
    setNav("tournaments");
  }, [setNav]);
  return (
    <Layout>
      <h1 className="page-title">Tournaments</h1>
    </Layout>
  );
}
