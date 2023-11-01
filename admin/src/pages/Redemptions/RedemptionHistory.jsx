import { useContext, useEffect } from "react";

import Layout from "../../components/layout";
import { NavContext } from "../../context/NavContext";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui";

export default function RedemptionHistory() {
  const { setNav } = useContext(NavContext);

  useEffect(() => {
    setNav("redemptions");
  }, [setNav]);

  return (
    <Layout>
      <div className="flex justify-between items-center">
        <h1 className="page-title">Redemption History</h1>
        <Link to="/redemptions" className="block w-fit">
          <Button>back to list</Button>
        </Link>
      </div>
      <div className="mt-6"></div>
    </Layout>
  );
}
