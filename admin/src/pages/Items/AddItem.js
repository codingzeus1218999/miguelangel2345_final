import { useContext, useEffect } from "react";
import { Link } from "react-router-dom";

import Layout from "../../components/layout";
import Button from "../../components/ui/Button";

import { NavContext } from "../../context/NavContext";

export default function AddItem() {
  const { setNav } = useContext(NavContext);

  useEffect(() => {
    setNav("items");
  }, [setNav]);

  return (
    <Layout>
      <h1 className="page-title">Add Item</h1>
      <Link to="/items" className="mt-6 block w-fit">
        <Button>back to list</Button>
      </Link>
      <div className="mt-6"></div>
    </Layout>
  );
}
