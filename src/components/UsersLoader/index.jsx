import { useState, useEffect} from "react";
import classNames from "classnames";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";
import styles from "./UsersLoader.module.sass";
import getUsers from "../../api";
import UserItem from "./UserItem";

const INIT_VALS = {
  users: [],
  isFetching: false,
  error: null,
  currentPage: 1,
  resultsPerPage: 5,
  selectedGender: "",
  isLastPage: false,
};

export default function UsersLoader() {
  const [users, setUsers] = useState(INIT_VALS.users);
  const [isFetching, setIsFetching] = useState(INIT_VALS.isFetching);
  const [error, setError] = useState(INIT_VALS.error);
  const [currentPage, setCurrentPage] = useState(INIT_VALS.currentPage);
  const [resultsPerPage, setResultsPerPage] = useState(
    INIT_VALS.resultsPerPage,
  );
  const [selectedGender, setSelectedGender] = useState(
    INIT_VALS.selectedGender,
  );
  const [isLastPage, setIsLastPage] = useState(INIT_VALS.isLastPage);

  useEffect(() => {
    setIsFetching(true);
    setError(null);
    getUsers({
      page: currentPage,
      results: resultsPerPage,
      gender: selectedGender,
    })
      .then((data) => {
        setUsers(data.results);
        setIsLastPage(data.results.length < resultsPerPage);
      })
      .catch((e) => setError(e))
      .finally(() => setIsFetching(false));
  }, [currentPage, resultsPerPage, selectedGender]);

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const nextPage = () => {
    if (isLastPage) {
      return;
    }
    setCurrentPage(currentPage + 1);
  };

  const handleCountQueryChange = ({ target: { value } }) => {
    if (isNaN(value) || value < 1 || value > 15) {
      return;
    }
    setResultsPerPage(value);
    setCurrentPage(1);
  };

  const handleFilterChange = ({ target }) => {
    setSelectedGender(target.dataset.filter);
    setCurrentPage(1);
  };

  const pageLeftClasses = classNames(styles.pageBtn, {
    [styles.active]: currentPage >= 2,
    [styles.inactive]: currentPage < 2,
  });
  const pageRightClasses = classNames(styles.pageBtn, {
    [styles.active]: !isLastPage,
    [styles.inactive]: isLastPage,
  });
  let filterText = "";
  if (selectedGender === "") {
    filterText = "None";
  } else if (selectedGender === "female") {
    filterText = "Female";
  } else if (selectedGender === "male") {
    filterText = "Male";
  }

  return (
    <>
      <div className={styles.navigationBar}>
        <div className={styles.contentWrap}>
          <div className={styles.controlGroup}>
            <label htmlFor="resultCount" className={styles.label}>
              Results per Page
            </label>
            <input
              type="number"
              id="resultCount"
              name="resultCount"
              min="1"
              max="15"
              className={styles.pageInput}
              value={resultsPerPage}
              onChange={handleCountQueryChange}
            />
          </div>
          <div className={styles.controlGroup}>
            <div className={styles.genderDropdown}>
              <p className={styles.genderDropdownLabel}>Filter: {filterText}</p>
              <div className={styles.genderOptions}>
                <p
                  className={styles.genderOption}
                  data-filter=""
                  onClick={handleFilterChange}
                >
                  None
                </p>
                <p
                  className={styles.genderOption}
                  data-filter="female"
                  onClick={handleFilterChange}
                >
                  Female
                </p>
                <p
                  className={styles.genderOption}
                  data-filter="male"
                  onClick={handleFilterChange}
                >
                  Male
                </p>
              </div>
            </div>
          </div>
          <div className={styles.controlGroup}>
            <p>
              <span className={styles.label}>Page </span>
              <span className={styles.pageNum}>{currentPage}</span>
            </p>
            <button onClick={prevPage} className={pageLeftClasses}>
              <SlArrowLeft />
            </button>
            <button onClick={nextPage} className={pageRightClasses}>
              <SlArrowRight />
            </button>
          </div>
        </div>
      </div>
      <div className={styles.userList}>
        {error && (
          <div className={styles.error}>Error: {JSON.stringify(error)}</div>
        )}
        {isFetching && (
          <div className={styles.message}>Page is loading. Please wait...</div>
        )}
        {!error && !isFetching && (
          <>
            {users.map((u) => (
              <UserItem key={u.login.uuid} data={u} />
            ))}
          </>
        )}
      </div>
    </>
  );
}
