import { useContext, useEffect, useState } from "react";
import Avatar from "react-avatar";
import { NotificationManager } from "react-notifications";
import moment from "moment";
import DataTable from "react-data-table-component";

import Layout from "../../components/layout";
import { getRedemptions } from "../../apis";
import { NavContext } from "../../context/NavContext";
import { UserContext } from "../../context/UserContext";
import constants from "../../constants";
import { ProductDefault } from "../../assets/images";
import { commafy } from "../../utils";
import { StatusBadge } from "../../components/ui";

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

export default function PurchasedItems() {
  const { setNav } = useContext(NavContext);
  const { account } = useContext(UserContext);

  const [searchStr, setSearchStr] = useState(
    localStorage.getItem("my-redemption-search-str")
      ? localStorage.getItem("my-redemption-search-str")
      : ""
  );
  const [sortField, setSortField] = useState(
    localStorage.getItem("my-redemption-sort-field")
      ? localStorage.getItem("my-redemption-sort-field")
      : "name"
  );
  const [sortDir, setSortDir] = useState(
    localStorage.getItem("my-redemption-sort-dir")
      ? localStorage.getItem("my-redemption-sort-dir")
      : "asc"
  );
  const [perPage, setPerPage] = useState(
    localStorage.getItem("my-redemption-per-page")
      ? localStorage.getItem("my-redemption-per-page")
      : 10
  );
  const [currentPage, setCurrentPage] = useState(
    localStorage.getItem("my-redemption-current-page")
      ? localStorage.getItem("my-redemption-current-page")
      : 1
  );
  const [totalRows, setTotalRows] = useState(0);
  const [redemptions, setRedemptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadCount, setLoadCount] = useState(0);

  const columns = [
    {
      name: "#",
      field: "image",
      selector: (row) => (
        <Avatar
          size="40"
          src={
            row.image ? `${constants.ITEM_DIR}/${row.image}` : ProductDefault
          }
        />
      ),
      width: "70px",
    },
    {
      name: "Name",
      field: "name",
      sortable: true,
      selector: (row) => row.name,
      width: "300px",
    },
    {
      name: "Type",
      field: "type",
      selector: (row) => row.type,
      sortable: true,
      width: "100px",
    },
    {
      name: "Description",
      field: "description",
      selector: (row) => row.description,
    },
    {
      name: "Cost",
      field: "cost",
      selector: (row) => commafy(row.cost),
      sortable: true,
      width: "100px",
    },
    {
      name: "Date",
      field: "date",
      selector: (row) => moment(row.date).format("YYYY/MM/DD"),
      sortable: true,
      width: "200px",
    },
    {
      name: "State",
      selector: (row) =>
        row.state === "pending" ? (
          "pending"
        ) : (
          <StatusBadge
            status={row.state === "rejected"}
            labels={["Approved", "Rejected"]}
          />
        ),
      width: "150px",
    },
  ];

  useEffect(() => {
    setNav("purchased-items");
  }, [setNav]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getRedemptions({
          searchStr,
          sortDir,
          sortField,
          currentPage,
          perPage,
          userId: account._id,
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
      <h1 className="page-title">Purchased Items</h1>
      <input
        className="pt-search-input mt-6"
        placeholder="Search by name or description..."
        type="text"
        value={searchStr}
        onChange={({ target }) => {
          setSearchStr(target.value);
          localStorage.setItem("my-redemption-search-str", target.value);
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
            localStorage.setItem("my-redemption-per-page", pp);
          }}
          onChangePage={(p) => {
            if (loadCount !== 0) {
              setCurrentPage(p);
              localStorage.setItem("my-redemption-current-page", p);
            }
            setLoadCount(loadCount + 1);
          }}
          sortServer
          onSort={(c, d) => {
            setSortField(c.field);
            setSortDir(d === "asc" ? "asc" : "desc");
            localStorage.setItem("my-redemption-sort-field", c.field);
            localStorage.setItem(
              "my-redemption-sort-dir",
              d === "asc" ? "asc" : "desc"
            );
          }}
        />
      </div>
    </Layout>
  );
}
