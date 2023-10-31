import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Layout from "../../components/layout";
import { NavContext } from "../../context/NavContext";
import { Button } from "../../components/ui";

export default function NotFound() {
  const { setNav } = useContext(NavContext);
  const navigate = useNavigate();

  useEffect(() => {
    setNav("not-found");
  }, [setNav]);

  return (
    <Layout>
      <div className="flex flex-row justify-center items-center mt-20">
        <div className="text-center pt-box p-12 rounded-md">
          <h1 className="text-white font-extrabold text-4xl text-center">
            Not Found
          </h1>
          <h1 className="text-white text-center mt-6">
            Could not find requested resource
          </h1>
          <Button className="mt-6" onClick={() => navigate("/")}>
            Return to homepage
          </Button>
        </div>
      </div>
    </Layout>
  );
}
