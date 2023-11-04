import { useContext, useEffect, useState } from "react";
import { NotificationManager } from "react-notifications";
import DataTable from "react-data-table-component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faClock,
  faMultiply,
} from "@fortawesome/free-solid-svg-icons";
import Avatar from "react-avatar";
import moment from "moment";
import { Link } from "react-router-dom";

import Layout from "../../components/layout";
import { NavContext } from "../../context/NavContext";
import {
  getRedemptionPendingList,
  processRedemption as processRedemptionApi,
} from "../../apis";
import { Button, RedemptionDetail } from "../../components/ui";
import constants from "../../constants";
import { ProductDefault } from "../../assets/images";

const customStyles = {
  pagination: {
    style: {
      borderRadius: "0 0 6px 6px",
    },
  },
  headCells: {
    style: {
      textTransform: "uppercase",
    },
  },
};

export default function Redemptions() {
  const { setNav } = useContext(NavContext);
  const [searchStr, setSearchStr] = useState(
    localStorage.getItem("redemptions-search-str")
      ? localStorage.getItem("redemptions-search-str")
      : ""
  );
  const [sortField, setSortField] = useState(
    localStorage.getItem("redemptions-sort-field")
      ? localStorage.getItem("redemptions-sort-field")
      : "name"
  );
  const [sortDir, setSortDir] = useState(
    localStorage.getItem("redemptions-sort-dir")
      ? localStorage.getItem("redemptions-sort-dir")
      : "asc"
  );
  const [perPage, setPerPage] = useState(
    localStorage.getItem("redemptions-per-page")
      ? localStorage.getItem("redemptions-per-page")
      : 10
  );
  const [currentPage, setCurrentPage] = useState(
    localStorage.getItem("redemptions-current-page")
      ? localStorage.getItem("redemptions-current-page")
      : 1
  );
  const [totalRows, setTotalRows] = useState(0);
  const [redemptions, setRedemptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadCount, setLoadCount] = useState(0);

  const processRedemption = async (id, state) => {
    setLoading(true);
    try {
      const res = await processRedemptionApi(id, state, {
        searchStr,
        sortDir,
        sortField,
        currentPage,
        perPage,
      });
      if (res.success) {
        setRedemptions(res.data.redemptions);
        setTotalRows(res.data.count);
        NotificationManager.success(res.message);
      } else {
        NotificationManager.error(res.message);
      }
    } catch (err) {
      console.log(err);
      NotificationManager.error(
        "Something was wrong with connection with server"
      );
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      name: "#",
      field: "purchasedItem.image",
      selector: (row) => (
        <Avatar
          size="40"
          src={
            row.purchasedItem.image
              ? `${constants.ITEM_DIR}/${row.purchasedItem.image}`
              : ProductDefault
          }
        />
      ),
      width: "70px",
    },
    {
      name: "Name",
      field: "purchasedItem.name",
      sortable: true,
      selector: (row) => row.purchasedItem.name,
    },
    {
      name: "Type",
      field: "purchasedItem.type",
      selector: (row) => row.purchasedItem.type,
      sortable: true,
      width: "100px",
    },
    {
      name: "Type",
      field: "details",
      selector: (row) => <RedemptionDetail details={row.details} />,
      width: "300px",
    },
    {
      name: "User kick name",
      field: "name",
      selector: (row) => row.name,
      sortable: true,
      width: "200px",
    },
    {
      name: "User email",
      field: "email",
      selector: (row) => row.email,
      sortable: true,
      width: "200px",
    },
    {
      name: "Date",
      field: "purchaseDate",
      selector: (row) => moment(row.purchaseDate).format("YYYY/MM/DD"),
      sortable: true,
      width: "100px",
    },
    {
      name: "Action",
      selector: (row) => (
        <>
          <span
            onClick={() => processRedemption(row._id, "approved")}
            className="text-green-600 hover:font-bold cursor-pointer"
          >
            <FontAwesomeIcon icon={faCheck} />
          </span>
          &nbsp;&nbsp;&nbsp;
          <span
            onClick={() => processRedemption(row._id, "rejected")}
            className="text-red-600 hover:font-bold cursor-pointer"
          >
            <FontAwesomeIcon icon={faMultiply} />
          </span>
        </>
      ),
      width: "80px",
    },
  ];

  useEffect(() => {
    setNav("redemptions");
  }, [setNav]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getRedemptionPendingList({
          searchStr,
          sortDir,
          sortField,
          currentPage,
          perPage,
        });
        if (res.success) {
          console.log(res.data.redemptions);
          setRedemptions(res.data.redemptions);
          setTotalRows(res.data.count);
          setLoading(false);
        } else {
          NotificationManager.error(res.message);
        }
      } catch (err) {
        console.log(err);
        NotificationManager.error(
          "Something was wrong with connection with server"
        );
      }
    };
    fetchData();
  }, [sortField, sortDir, currentPage, perPage, searchStr]);

  return (
    <Layout>
      <h1 className="page-title">Redemptions</h1>
      <div className="mt-6 flex flex-row gap-2 flex-wrap items-center justify-between">
        <div className="flex flex-row gap-2 flex-wrap items-center">
          <input
            className="pt-search-input"
            placeholder="Search by name or description..."
            type="text"
            value={searchStr}
            onChange={({ target }) => {
              setSearchStr(target.value);
              localStorage.setItem("redemptions-search-str", target.value);
            }}
          />
        </div>
        <Link to="/redemption-history">
          <Button>
            <FontAwesomeIcon icon={faClock} /> History
          </Button>
        </Link>
      </div>
      <div className="mt-6 rounded-t-md">
        <DataTable
          data={redemptions}
          columns={columns}
          customStyles={customStyles}
          dense
          fixedHeader
          highlightOnHover
          progressPending={loading}
          pagination
          paginationServer
          paginationTotalRows={totalRows}
          paginationDefaultPage={currentPage}
          paginationPerPage={perPage}
          onChangeRowsPerPage={(pp) => {
            setPerPage(pp);
            localStorage.setItem("redemptions-per-page", pp);
          }}
          onChangePage={(p) => {
            if (loadCount !== 0) {
              setCurrentPage(p);
              localStorage.setItem("redemptions-current-page", p);
            }
            setLoadCount(loadCount + 1);
          }}
          sortServer
          onSort={(c, d) => {
            setSortField(c.field);
            setSortDir(d === "asc" ? "asc" : "desc");
            localStorage.setItem("redemptions-sort-field", c.field);
            localStorage.setItem(
              "redemptions-sort-dir",
              d === "asc" ? "asc" : "desc"
            );
          }}
        />
      </div>
    </Layout>
  );
}
