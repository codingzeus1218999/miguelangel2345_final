import { useContext, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import Avatar from "react-avatar";
import { Link } from "react-router-dom";
import moment from "moment";
import { NotificationManager } from "react-notifications";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

import Layout from "../../components/layout";
import StatusBadge from "../../components/ui/StatusBadge";

import DefaultAvatarImage from "../../assets/images/avatar.jpg";

import { NavContext } from "../../context/NavContext";

import { commafy } from "../../utils/numberUtils";
import { getUserList } from "../../utils/api";
import constants from "../../constants";

const columns = [
  {
    name: "#",
    field: "avatar",
    selector: (row) => (
      <Avatar
        round={true}
        size="40"
        src={
          row.avatar
            ? `${constants.AVATAR_DIR}/${row.avatar}`
            : DefaultAvatarImage
        }
      />
    ),
    width: "70px",
  },
  {
    name: "Kick name",
    field: "name",
    selector: (row) => row.name,
    sortable: true,
    width: "200px",
  },
  {
    name: "Email",
    field: "email",
    selector: (row) => row.email,
    sortable: true,
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
    field: "isModerator",
    selector: (row) => (
      <StatusBadge status={row.isModerator} labels={["no", "yes"]} />
    ),
    width: "150px",
  },
  {
    name: "Status",
    field: "allowed",
    selector: (row) => (
      <StatusBadge status={row.allowed} labels={["not-allowed", "allowed"]} />
    ),
    width: "150px",
  },
  {
    name: "Role",
    field: "role",
    selector: (row) => (
      <StatusBadge status={row.role === "admin"} labels={["user", "admin"]} />
    ),
    width: "100px",
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
      <Link
        to={`/users/${row._id}`}
        className="text-yellow-600 hover:font-bold"
      >
        <FontAwesomeIcon icon={faEdit} />
      </Link>
    ),
    width: "80px",
  },
];

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

export default function Users() {
  const { setNav } = useContext(NavContext);

  const [searchStr, setSearchStr] = useState(
    localStorage.getItem("users-search-str")
      ? localStorage.getItem("users-search-str")
      : ""
  );
  const [sortField, setSortField] = useState(
    localStorage.getItem("users-sort-field")
      ? localStorage.getItem("users-sort-field")
      : "name"
  );
  const [sortDir, setSortDir] = useState(
    localStorage.getItem("users-sort-dir")
      ? localStorage.getItem("users-sort-dir")
      : "asc"
  );
  const [perPage, setPerPage] = useState(
    localStorage.getItem("users-per-page")
      ? localStorage.getItem("users-per-page")
      : 10
  );
  const [currentPage, setCurrentPage] = useState(
    localStorage.getItem("users-current-page")
      ? localStorage.getItem("users-current-page")
      : 1
  );
  const [totalRows, setTotalRows] = useState(0);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadCount, setLoadCount] = useState(0);

  useEffect(() => {
    setNav("users");
  }, [setNav]);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getUserList({
          searchStr,
          sortDir,
          sortField,
          currentPage,
          perPage,
        });
        setUsers(res.users);
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
      <h1 className="page-title">Users</h1>
      <div className="mt-6 flex flex-row gap-2 flex-wrap items-center">
        <input
          className="pt-search-input"
          placeholder="Search by kick name or email..."
          type="text"
          value={searchStr}
          onChange={({ target }) => {
            setSearchStr(target.value);
          }}
        />
      </div>
      <div className="mt-6 rounded-t-md">
        <DataTable
          data={users}
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
            localStorage.setItem("users-per-page", pp);
          }}
          onChangePage={(p) => {
            if (loadCount !== 0) {
              setCurrentPage(p);
              localStorage.setItem("users-current-page", p);
            }
            setLoadCount(loadCount + 1);
          }}
          sortServer
          onSort={(c, d) => {
            setSortField(c.field);
            setSortDir(d === "asc" ? "asc" : "desc");
            localStorage.setItem("users-sort-field", c.field);
            localStorage.setItem(
              "users-sort-dir",
              d === "asc" ? "asc" : "desc"
            );
          }}
        />
      </div>
    </Layout>
  );
}
