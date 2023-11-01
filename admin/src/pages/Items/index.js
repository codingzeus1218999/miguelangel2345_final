import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { faAdd, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NotificationManager } from "react-notifications";
import DataTable from "react-data-table-component";
import moment from "moment";
import Avatar from "react-avatar";

import Layout from "../../components/layout";
import { NavContext } from "../../context/NavContext";
import { Button, StatusBadge } from "../../components/ui";
import constants from "../../constants";
import { ProductDefault } from "../../assets/images";
import { commafy } from "../../utils";
import { getItemList, deleteItem as deleteItemApi } from "../../apis";

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

export default function Items() {
  const { setNav } = useContext(NavContext);
  const [searchStr, setSearchStr] = useState(
    localStorage.getItem("items-search-str")
      ? localStorage.getItem("items-search-str")
      : ""
  );
  const [sortField, setSortField] = useState(
    localStorage.getItem("items-sort-field")
      ? localStorage.getItem("items-sort-field")
      : "name"
  );
  const [sortDir, setSortDir] = useState(
    localStorage.getItem("items-sort-dir")
      ? localStorage.getItem("items-sort-dir")
      : "asc"
  );
  const [perPage, setPerPage] = useState(
    localStorage.getItem("items-per-page")
      ? localStorage.getItem("items-per-page")
      : 10
  );
  const [currentPage, setCurrentPage] = useState(
    localStorage.getItem("items-current-page")
      ? localStorage.getItem("items-current-page")
      : 1
  );
  const [totalRows, setTotalRows] = useState(0);
  const [items, setItems] = useState([]);
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
      selector: (row) => row.name,
      sortable: true,
      width: "100px",
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
      name: "Quantity",
      field: "quantity",
      selector: (row) => commafy(row.quantity),
      sortable: true,
      width: "100px",
    },
    {
      name: "Only subscriber",
      field: "shouldBeSubscriber",
      selector: (row) => (
        <StatusBadge status={row.shouldBeSubscriber} labels={["no", "yes"]} />
      ),
      width: "100px",
    },
    {
      name: "Created_at",
      field: "createdSt",
      selector: (row) => moment(row.createdAt).format("MM/DD/YYYY"),
      sortable: true,
      width: "100px",
    },
    {
      name: "Action",
      selector: (row) => (
        <>
          <Link
            to={`/items/${row._id}`}
            className="text-yellow-600 hover:font-bold"
          >
            <FontAwesomeIcon icon={faEdit} />
          </Link>
          &nbsp;&nbsp;&nbsp;
          <span
            onClick={() => deleteItem(row._id)}
            className="text-red-600 hover:font-bold cursor-pointer"
          >
            <FontAwesomeIcon icon={faTrash} />
          </span>
        </>
      ),
      width: "80px",
    },
  ];

  const deleteItem = async (id) => {
    setLoading(true);
    try {
      const res = await deleteItemApi(id, {
        searchStr,
        sortDir,
        sortField,
        currentPage,
        perPage,
      });
      if (res.success) {
        setItems(res.data.items);
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

  useEffect(() => {
    setNav("items");
  }, [setNav]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getItemList({
          searchStr,
          sortDir,
          sortField,
          currentPage,
          perPage,
        });
        if (res.success) {
          setItems(res.data.items);
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
      <h1 className="page-title">Items</h1>
      <div className="mt-6 flex flex-row gap-2 flex-wrap items-center justify-between">
        <div className="flex flex-row gap-2 flex-wrap items-center">
          <input
            className="pt-search-input"
            placeholder="Search by name or description..."
            type="text"
            value={searchStr}
            onChange={({ target }) => {
              setSearchStr(target.value);
            }}
          />
        </div>
        <Link to="/items/add">
          <Button>
            <FontAwesomeIcon icon={faAdd} /> Add
          </Button>
        </Link>
      </div>
      <div className="mt-6 rounded-t-md">
        <DataTable
          data={items}
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
            localStorage.setItem("items-per-page", pp);
          }}
          onChangePage={(p) => {
            if (loadCount !== 0) {
              setCurrentPage(p);
              localStorage.setItem("items-current-page", p);
            }
            setLoadCount(loadCount + 1);
          }}
          sortServer
          onSort={(c, d) => {
            setSortField(c.field);
            setSortDir(d === "asc" ? "asc" : "desc");
            localStorage.setItem("items-sort-field", c.field);
            localStorage.setItem(
              "items-sort-dir",
              d === "asc" ? "asc" : "desc"
            );
          }}
        />
      </div>
    </Layout>
  );
}
