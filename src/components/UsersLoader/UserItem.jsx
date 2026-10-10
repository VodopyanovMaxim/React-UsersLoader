import classNames from "classnames";
import PropTypes from "prop-types";
import { FaHouseUser } from "react-icons/fa";
import styles from "./UserItem.module.sass";


export default function UserItem(props) {
  const {
    name: { first, last },
    email,
    location: { city, state, country },
    picture: { medium },
    gender,
  } = props.data;
  const fullName = `${first} ${last}`;
  const fullLoc = `${city}, ${state}, ${country}`;
  const userCardClasses = classNames(styles.userCard, {
    [styles.male]: gender === "male",
    [styles.female]: gender === "female",
  });
  return (
    <article className={userCardClasses}>
      <img src={medium} alt={fullName} />
      <div className={styles.info}>
        <h2 className={styles.name}>{fullName}</h2>
        <p>{email}</p>
        <div className={styles.location}>
          <FaHouseUser />
          {fullLoc}
        </div>
      </div>
    </article>
  );
}
