import { BOOKING_STATUS, cancellationLabel } from "../../utils/booking.js";
import styles from "./BookingStatus.module.css";

export default function BookingStatus({ status, resolution, detailed = false }) {
  const content = BOOKING_STATUS[status] || { label: status, message: status };
  const label = status === "cancelled" ? cancellationLabel(resolution) : content.label;
  return <div className={styles.status} data-status={status}>
    <strong>{label}</strong>{detailed && <span>{content.message}</span>}
  </div>;
}
