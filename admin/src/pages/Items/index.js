import { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Layout from "../../components/layout";
import { NavContext } from "../../context/NavContext";
import { Button } from "../../components/ui";

export default function Items() {
  const { setNav } = useContext(NavContext);
  useEffect(() => {
    setNav("items");
  }, [setNav]);

  return (
    <Layout>
      <h1 className="page-title">Items</h1>
      <div className="mt-6 flex flex-row gap-2 flex-wrap items-center justify-between">
        <div className="flex flex-row gap-2 flex-wrap items-center">
          {/* <input
            className="pt-search-input"
            placeholder="Search by name or description..."
            type="text"
            value={searchStr}
            onChange={({ target }) => {
              setSearchStr(target.value);
            }}
          /> */}
        </div>
        <Link to="/items/add">
          <Button>
            <FontAwesomeIcon icon={faAdd} /> Add
          </Button>
        </Link>
      </div>
      <div className="mt-6 rounded-t-md"></div>
    </Layout>
  );
}
