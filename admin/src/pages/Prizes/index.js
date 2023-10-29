import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { faAdd, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Avatar from "react-avatar";
import moment from "moment";
import { NotificationManager } from "react-notifications";
import DataTable from "react-data-table-component";

import Layout from "../../components/layout";
import Button from "../../components/ui/Button";
import StatusBadge from "../../components/ui/StatusBadge";

import { NavContext } from "../../context/NavContext";

import DefaultItemImage from "../../assets/images/money.jfif";

import { commafy } from "../../utils";
import { getPrizeList, deletePrizeApi } from "../../apis";
import constants from "../../constants";

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

export default function Prizes() {
  const { setNav } = useContext(NavContext);
  const [searchStr, setSearchStr] = useState(
    localStorage.getItem("prizes-search-str")
      ? localStorage.getItem("prizes-search-str")
      : ""
  );
  const [sortField, setSortField] = useState(
    localStorage.getItem("prizes-sort-field")
      ? localStorage.getItem("prizes-sort-field")
      : "name"
  );
  const [sortDir, setSortDir] = useState(
    localStorage.getItem("prizes-sort-dir")
      ? localStorage.getItem("prizes-sort-dir")
      : "asc"
  );
  const [perPage, setPerPage] = useState(
    localStorage.getItem("prizes-per-page")
      ? localStorage.getItem("prizes-per-page")
      : 10
  );
  const [currentPage, setCurrentPage] = useState(
    localStorage.getItem("prizes-current-page")
      ? localStorage.getItem("prizes-current-page")
      : 1
  );
  const [totalRows, setTotalRows] = useState(0);
  const [prizes, setPrizes] = useState([]);
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
            row.image ? `${constants.PRIZE_DIR}/${row.image}` : DefaultItemImage
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
      name: "Description",
      field: "description",
      selector: (row) => row.description,
    },
    {
      name: "Points",
      field: "points",
      selector: (row) => commafy(row.points),
      sortable: true,
      width: "100px",
    },
    {
      name: "Moderator",
      field: "shouldModerator",
      selector: (row) => (
        <StatusBadge status={row.shouldModerator} labels={["no", "yes"]} />
      ),
      width: "100px",
    },
    {
      name: "Locked",
      field: "isLocked",
      selector: (row) => (
        <StatusBadge status={row.isLocked} labels={["no", "locked"]} />
      ),
      width: "100px",
    },
    {
      name: "Wager",
      field: "wagerMethod",
      selector: (row) =>
        row.wagerMethod === ""
          ? ""
          : `${row.wagerMethod} / ${row.wagerMin} / ${row.wagerMax}`,
      width: "150px",
    },
    {
      name: "Created_at",
      field: "created_at",
      selector: (row) => moment(row.created_at).format("MM/DD/YYYY"),
      sortable: true,
      width: "100px",
    },
    {
      name: "Action",
      selector: (row) => (
        <>
          <Link
            to={`/prizes/${row._id}`}
            className="text-yellow-600 hover:font-bold"
          >
            <FontAwesomeIcon icon={faEdit} />
          </Link>
          &nbsp;&nbsp;&nbsp;
          <span
            onClick={() => deletePrize(row._id)}
            className="text-red-600 hover:font-bold cursor-pointer"
          >
            <FontAwesomeIcon icon={faTrash} />
          </span>
        </>
      ),
      width: "80px",
    },
  ];

  const deletePrize = async (id) => {
    setLoading(true);
    try {
      const res = await deletePrizeApi(id, {
        searchStr,
        sortDir,
        sortField,
        currentPage,
        perPage,
      });
      setLoading(false);
      setPrizes(res.prizes);
      setTotalRows(res.count);
      NotificationManager.success("Deleted successfuly");
    } catch (err) {
      NotificationManager.error(
        "Something was wrong with connection with server"
      );
      setLoading(false);
    }
  };

  useEffect(() => {
    setNav("prizes");
  }, [setNav]);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getPrizeList({
          searchStr,
          sortDir,
          sortField,
          currentPage,
          perPage,
        });
        setPrizes(res.prizes);
        setTotalRows(res.count);
        setLoading(false);
      } catch (err) {
        NotificationManager.error(
          "Something was wrong with connection with server"
        );
      }
    };
    fetchData();
  }, [sortField, sortDir, currentPage, perPage, searchStr]);

  return (
    <Layout>
      <h1 className="page-title">Prizes</h1>
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
        <Link to="/prizes/add">
          <Button>
            <FontAwesomeIcon icon={faAdd} /> Add
          </Button>
        </Link>
      </div>
      <div className="mt-6 rounded-t-md">
        <DataTable
          data={prizes}
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
            localStorage.setItem("prizes-per-page", pp);
          }}
          onChangePage={(p) => {
            if (loadCount !== 0) {
              setCurrentPage(p);
              localStorage.setItem("prizes-current-page", p);
            }
            setLoadCount(loadCount + 1);
          }}
          sortServer
          onSort={(c, d) => {
            setSortField(c.field);
            setSortDir(d === "asc" ? "asc" : "desc");
            localStorage.setItem("prizes-sort-field", c.field);
            localStorage.setItem(
              "prizes-sort-dir",
              d === "asc" ? "asc" : "desc"
            );
          }}
        />
      </div>
    </Layout>
  );
}
