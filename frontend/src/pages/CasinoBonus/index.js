import { useContext, useEffect } from "react";
import Layout from "../../components/layout";
import { NavContext } from "../../context/NavContext";

export default function CasinoBonus() {
  const { setNav } = useContext(NavContext);
  useEffect(() => {
    setNav("casino-bonus");
  }, [setNav]);
  return (
    <Layout>
      <h1 className="page-title">CasinoBonus</h1>
    </Layout>
  );
}
