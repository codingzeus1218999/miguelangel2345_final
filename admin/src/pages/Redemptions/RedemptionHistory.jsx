import { useContext, useEffect, useState } from "react";
import { NotificationManager } from "react-notifications";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";
import Avatar from "react-avatar";
import moment from "moment";

import Layout from "../../components/layout";
import { NavContext } from "../../context/NavContext";
import {
  Button,
  RedemptionCode,
  RedemptionDetail,
  StatusBadge,
} from "../../components/ui";
import constants from "../../constants";
import { ProductDefault } from "../../assets/images";
import { getRedemptionHistoryList } from "../../apis";

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

export default function RedemptionHistory() {
  const { setNav } = useContext(NavContext);
  const [searchStr, setSearchStr] = useState(
    localStorage.getItem("redemption-history-search-str")
      ? localStorage.getItem("redemption-history-search-str")
      : ""
  );
  const [sortField, setSortField] = useState(
    localStorage.getItem("redemption-history-sort-field")
      ? localStorage.getItem("redemption-history-sort-field")
      : "name"
  );
  const [sortDir, setSortDir] = useState(
    localStorage.getItem("redemption-history-sort-dir")
      ? localStorage.getItem("redemption-history-sort-dir")
      : "asc"
  );
  const [perPage, setPerPage] = useState(
    localStorage.getItem("redemption-history-per-page")
      ? localStorage.getItem("redemption-history-per-page")
      : 10
  );
  const [currentPage, setCurrentPage] = useState(
    localStorage.getItem("redemption-history-current-page")
      ? localStorage.getItem("redemption-history-current-page")
      : 1
  );
  const [totalRows, setTotalRows] = useState(0);
  const [redemptions, setRedemptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadCount, setLoadCount] = useState(0);

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
      name: "Details",
      field: "details",
      selector: (row) =>
        row.purchasedItem.type === "redeem" ? (
          <RedemptionDetail details={row.details} />
        ) : row.purchasedItem.type === "key" ? (
          <RedemptionCode code={row.code} />
        ) : (
          ""
        ),
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
      name: "State",
      selector: (row) => (
        <StatusBadge
          status={row.state === "approved"}
          labels={["Rejected", "Approved"]}
        />
      ),
      width: "200px",
    },
  ];

  useEffect(() => {
    setNav("redemptions");
  }, [setNav]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getRedemptionHistoryList({
          searchStr,
          sortDir,
          sortField,
          currentPage,
          perPage,
        });
        if (res.success) {
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
      <div className="flex justify-between items-center">
        <h1 className="page-title">Redemption History</h1>
        <Link to="/redemptions" className="block w-fit">
          <Button>back to list</Button>
        </Link>
      </div>
      <input
        className="pt-search-input mt-6"
        placeholder="Search by name or description..."
        type="text"
        value={searchStr}
        onChange={({ target }) => {
          setSearchStr(target.value);
          localStorage.setItem("redemption-history-search-str", target.value);
        }}
      />
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
