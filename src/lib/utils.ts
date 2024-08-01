import { isThisYear, format } from "date-fns";
import { Timestamp } from "firebase/firestore";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPostDate(createdAt: Timestamp | String) {
  let date: Date;
  let formattedDate;

  if (createdAt instanceof Timestamp) {
    date = createdAt.toDate();
  } else {
    date = new Date(String(createdAt));
  }

  if (isThisYear(date)) {
    // If the date is from the current year, format it as "Jun 18 at 12:13 PM"
    formattedDate = format(date, "MMM d 'at' h:mm aaa");
  } else {
    // If the date is from a different year, format it as "18 Jun 2023"
    formattedDate = format(date, "d MMM yyyy");
  }

  return formattedDate.replace(/am|pm/g, (match) => match.toUpperCase());
}
