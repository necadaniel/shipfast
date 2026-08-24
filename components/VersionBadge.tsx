import { cn } from "@/lib/utils";
import {
  displayVersion,
  fullVersion,
  detailedVersion,
  releasedAt,
} from "@/libs/version";

/**
 * Shows the app version. Defaults to the compact "v1.2.3"; pass
 * `detail="build"` for "v1.2.3+27" or `detail="full"` to include the git SHA.
 *
 * The full string and release date are always in the tooltip, so a user can
 * read them back to you from a bug report.
 */
const VersionBadge = ({
  detail = "version",
  className,
}: {
  detail?: "version" | "build" | "full";
  className?: string;
}) => {
  const label =
    detail === "full"
      ? detailedVersion
      : detail === "build"
        ? fullVersion
        : displayVersion;

  return (
    <span
      title={`${detailedVersion} — released ${new Date(releasedAt).toLocaleDateString()}`}
      className={cn("text-muted-foreground font-mono text-xs", className)}
    >
      {label}
    </span>
  );
};

export default VersionBadge;
