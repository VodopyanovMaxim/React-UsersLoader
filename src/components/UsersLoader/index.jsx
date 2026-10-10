import { Component } from "react";
import styles from "./UsersLoader.module.sass";
import getUsers from "../../api";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";
import UserItem from "./UserItem";
import classNames from "classnames";

const INIT_VALS = {
  users: [],
  isFetching: false,
  error: null,
  currentPage: 1,
  resultsPerPage: 5,
  selectedGender: "",
  isLastPage: false,
};

class UsersLoader extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: INIT_VALS.users,
      isFetching: INIT_VALS.isFetching,
      error: INIT_VALS.error,
      currentPage: INIT_VALS.currentPage,
      resultsPerPage: INIT_VALS.resultsPerPage,
      selectedGender: INIT_VALS.selectedGender,
      isLastPage: INIT_VALS.isLastPage,
    };
  }

  loadUsers = () => {
    const { currentPage, resultsPerPage, selectedGender, isLastPage } =
      this.state;
    this.setState({ isFetching: true });
    getUsers({
      page: currentPage,
      results: resultsPerPage,
      gender: selectedGender,
    })
      .then((data) =>
        this.setState({
          users: data.results,
          isLastPage: data.results.length < resultsPerPage,
        }),
      )
      .catch((e) => this.setState({ error: e }))
      .finally(() => this.setState({ isFetching: false }));
  };

  componentDidMount() {
    this.loadUsers();
  }

  componentDidUpdate(prevProps, prevState) {
    const { currentPage, resultsPerPage, selectedGender } = this.state;
    if (
      currentPage !== prevState.currentPage ||
      resultsPerPage !== prevState.resultsPerPage ||
      selectedGender !== prevState.selectedGender
    ) {
      this.loadUsers();
    }
  }

  prevPage = () => {
    const { currentPage } = this.state;
    if (currentPage > 1) {
      this.setState({ currentPage: currentPage - 1 });
    }
  };

  nextPage = () => {
    const { isLastPage } = this.state;
    if (isLastPage) {
      return;
    }
    const { currentPage } = this.state;
    this.setState({ currentPage: currentPage + 1 });
  };

  handleCountQueryChange = ({ target: { value } }) => {
    if (isNaN(value) || value < 1 || value > 15) {
      return;
    }
    this.setState({
      resultsPerPage: value,
      currentPage: 1,
    });
  };

  handleFilterChange = ({ target }) => {
    this.setState({
      selectedGender: target.dataset.filter,
      currentPage: 1,
    });
  };

  render() {
    const {
      currentPage,
      users,
      isFetching,
      error,
      resultsPerPage,
      selectedGender,
      isLastPage,
    } = this.state;

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
                onChange={this.handleCountQueryChange}
              />
            </div>
            <div className={styles.controlGroup}>
              <div className={styles.genderDropdown}>
                <p className={styles.genderDropdownLabel}>
                  Filter: {filterText}
                </p>
                <div className={styles.genderOptions}>
                  <p
                    className={styles.genderOption}
                    data-filter=""
                    onClick={this.handleFilterChange}
                  >
                    None
                  </p>
                  <p
                    className={styles.genderOption}
                    data-filter="female"
                    onClick={this.handleFilterChange}
                  >
                    Female
                  </p>
                  <p
                    className={styles.genderOption}
                    data-filter="male"
                    onClick={this.handleFilterChange}
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
              <button onClick={this.prevPage} className={pageLeftClasses}>
                <SlArrowLeft />
              </button>
              <button onClick={this.nextPage} className={pageRightClasses}>
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
            <div className={styles.message}>
              Page is loading. Please wait...
            </div>
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
}

export default UsersLoader;
