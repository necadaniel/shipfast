"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  Clock,
  Plus,
  Minus,
  Edit,
  FileText,
  FolderOpen,
  History,
  Search,
  Filter,
  X,
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { DateRange } from "react-day-picker";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import toast from "react-hot-toast";

interface HistoryEntry {
  _id: string;
  action: "created" | "updated" | "deleted" | "bulk_import";
  variableKey: string;
  oldValue?: string;
  newValue?: string;
  createdAt: Date;
  user: {
    id: string;
    name: string;
    email?: string;
    image?: string;
  };
  metadata?: {
    source: "web" | "cli" | "api";
  };
}

interface Project {
  _id: string;
  name: string;
  description?: string;
  color: string;
  isTeamProject: boolean;
}

interface ProjectHistoryClientProps {
  project: Project;
  history: HistoryEntry[];
}

// Get unique users from history for the filter
const getUniqueUsers = (history: HistoryEntry[]) => {
  const userMap = new Map();
  history.forEach((entry) => {
    if (entry.user.id && !userMap.has(entry.user.id)) {
      userMap.set(entry.user.id, entry.user);
    }
  });
  return Array.from(userMap.values());
};

const actionConfig = {
  created: {
    icon: Plus,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    label: "Created",
  },
  updated: {
    icon: Edit,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    label: "Updated",
  },
  deleted: {
    icon: Minus,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    label: "Deleted",
  },
  bulk_import: {
    icon: FileText,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    label: "Imported",
  },
};

export default function ProjectHistoryClient({
  project,
  history: initialHistory,
}: ProjectHistoryClientProps) {
  const [history, setHistory] = useState<HistoryEntry[]>(initialHistory);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [userFilter, setUserFilter] = useState<string>("all");

  // Get unique users from initial history
  const uniqueUsers = getUniqueUsers(initialHistory);

  // Fetch filtered history
  const fetchHistory = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();

      if (actionFilter !== "all") {
        params.append("action", actionFilter);
      }

      if (dateRange?.from) {
        params.append("startDate", dateRange.from.toISOString());
      }

      if (dateRange?.to) {
        params.append("endDate", dateRange.to.toISOString());
      }

      if (searchQuery.trim()) {
        params.append("search", searchQuery.trim());
      }

      if (userFilter !== "all") {
        params.append("userId", userFilter);
      }

      const response = await fetch(
        `/api/projects/${project._id}/history?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch history");
      }

      const data = await response.json();

      // Format the history data
      const formattedHistory = data.history.map((entry: any) => ({
        _id: entry._id.toString(),
        action: entry.action,
        variableKey: entry.variableKey,
        oldValue: entry.oldValue,
        newValue: entry.newValue,
        createdAt: entry.createdAt,
        user: {
          id: entry.userId?._id?.toString() || "",
          name: entry.userId?.name || "Unknown User",
          email: entry.userId?.email,
          image: entry.userId?.image,
        },
        metadata: entry.metadata,
      }));

      setHistory(formattedHistory);
    } catch (error) {
      console.error("Error fetching history:", error);
      toast.error("Failed to fetch history");
    } finally {
      setLoading(false);
    }
  };

  // Apply filters when they change
  useEffect(() => {
    fetchHistory();
  }, [actionFilter, dateRange, userFilter]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery !== "") {
        fetchHistory();
      } else if (
        searchQuery === "" &&
        history.length !== initialHistory.length
      ) {
        fetchHistory();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const clearFilters = () => {
    setSearchQuery("");
    setActionFilter("all");
    setDateRange(undefined);
    setUserFilter("all");
  };

  const hasActiveFilters =
    searchQuery !== "" ||
    actionFilter !== "all" ||
    dateRange !== undefined ||
    userFilter !== "all";

  // Group history by date
  const groupedHistory = history.reduce((acc, entry) => {
    const date = format(new Date(entry.createdAt), "yyyy-MM-dd");
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(entry);
    return acc;
  }, {} as Record<string, HistoryEntry[]>);

  const sortedDates = Object.keys(groupedHistory).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  const getDateLabel = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (format(date, "yyyy-MM-dd") === format(today, "yyyy-MM-dd")) {
      return "Today";
    } else if (format(date, "yyyy-MM-dd") === format(yesterday, "yyyy-MM-dd")) {
      return "Yesterday";
    } else {
      return format(date, "MMMM d, yyyy");
    }
  };

  // Check if this is truly an empty project (no initial history at all)
  const isEmptyProject = initialHistory.length === 0 && !hasActiveFilters;

  // Show full-screen empty state only if project has never had any history
  if (isEmptyProject) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Back Button */}
        <div className="mb-6 sm:mb-8">
          <Link
            href="/dashboard/history"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to History
          </Link>
        </div>

        {/* Page Header */}
        <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center shadow-[0_1px_0_0_rgba(255,255,255,0.1)_inset,0_2px_8px_rgba(0,0,0,0.1)] flex-shrink-0"
            style={{ backgroundColor: `${project.color}20` }}
          >
            <History
              className="w-6 h-6 sm:w-7 sm:h-7"
              style={{ color: project.color }}
            />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              {project.name}
            </h1>
            {project.description && (
              <p className="text-sm sm:text-base text-muted-foreground">
                {project.description}
              </p>
            )}
          </div>
        </div>

        {/* Empty State for brand new project */}
        <div className="flex items-center justify-center min-h-[calc(100vh-20rem)] px-4">
          <div className="max-w-md w-full">
            <div className="rounded-2xl bg-gradient-to-br from-muted/50 to-muted/30 p-8 sm:p-12 text-center shadow-[0_1px_0_0_rgba(255,255,255,0.1)_inset,0_8px_32px_rgba(0,0,0,0.08)]">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-[0_1px_0_0_rgba(255,255,255,0.1)_inset,0_4px_16px_rgba(0,0,0,0.05)]">
                <Clock className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2 sm:mb-3">
                No Changes Yet
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8">
                No changes have been made to this project yet. Start adding,
                updating, or deleting variables to build your history.
              </p>
              <Link
                href={`/dashboard/project/${project._id}`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium shadow-[0_1px_0_0_rgba(255,255,255,0.25)_inset,0_4px_16px_rgba(0,0,0,0.15)] hover:shadow-[0_1px_0_0_rgba(255,255,255,0.25)_inset,0_6px_20px_rgba(0,0,0,0.2)] hover:translate-y-[-2px] transition-all"
              >
                <FolderOpen className="w-4 h-4" />
                Open Project
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main render with filters always visible
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Back Button */}
      <div className="mb-6 sm:mb-8">
        <Link
          href="/dashboard/history"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to History
        </Link>
      </div>

      {/* Page Header */}
      <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center shadow-[0_1px_0_0_rgba(255,255,255,0.1)_inset,0_2px_8px_rgba(0,0,0,0.1)] flex-shrink-0"
          style={{ backgroundColor: `${project.color}20` }}
        >
          <History
            className="w-6 h-6 sm:w-7 sm:h-7"
            style={{ color: project.color }}
          />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            {project.name}
          </h1>
          {project.description && (
            <p className="text-sm sm:text-base text-muted-foreground">
              {project.description}
            </p>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 ${
            showFilters ? "bg-primary/10" : ""
          }`}
        >
          <Filter className="w-4 h-4" />
          <span className="hidden sm:inline">Filters</span>
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-xs">
              {
                [
                  searchQuery !== "",
                  actionFilter !== "all",
                  dateRange !== undefined,
                  userFilter !== "all",
                ].filter(Boolean).length
              }
            </Badge>
          )}
        </Button>
      </div>

      {/* Filter Controls */}
      {showFilters && (
        <div className="mb-6 rounded-xl bg-gradient-to-br from-muted/50 to-muted/30 p-4 sm:p-6 shadow-[0_1px_0_0_rgba(255,255,255,0.1)_inset,0_4px_16px_rgba(0,0,0,0.08)]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search Input */}
            <div className="lg:col-span-2">
              <label className="text-sm font-medium text-foreground mb-2 block">
                Search Variables
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by variable name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Action Type Filter */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Action Type
              </label>
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Actions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="created">Created</SelectItem>
                  <SelectItem value="updated">Updated</SelectItem>
                  <SelectItem value="deleted">Deleted</SelectItem>
                  <SelectItem value="bulk_import">Imported</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* User Filter */}
            {uniqueUsers.length > 1 && (
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Team Member
                </label>
                <Select value={userFilter} onValueChange={setUserFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Members" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Members</SelectItem>
                    {uniqueUsers.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <div className="mt-4 flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
          <p className="mt-4 text-sm text-muted-foreground">
            Loading history...
          </p>
        </div>
      )}

      {/* Timeline */}
      {!loading && history.length === 0 && hasActiveFilters && (
        <div className="py-12">
          <div className="rounded-xl bg-gradient-to-br from-muted/50 to-muted/30 p-8 text-center shadow-[0_1px_0_0_rgba(255,255,255,0.1)_inset,0_4px_16px_rgba(0,0,0,0.08)]">
            <Search className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No Results Found
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              No history entries match your current filters. Try adjusting your
              search criteria.
            </p>
            <Button variant="outline" onClick={clearFilters} size="sm">
              <X className="w-4 h-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </div>
      )}

      {!loading && history.length > 0 && (
        <div className="space-y-6 sm:space-y-8">
          {sortedDates.map((date) => (
            <div key={date}>
              {/* Date Header */}
              <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm py-2 sm:py-3 mb-3 sm:mb-4 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
                <h2 className="text-base sm:text-lg font-semibold text-foreground">
                  {getDateLabel(date)}
                </h2>
              </div>

              {/* History Entries */}
              <div className="space-y-3">
                {groupedHistory[date].map((entry) => {
                  const config = actionConfig[entry.action];
                  const Icon = config.icon;

                  return (
                    <div
                      key={entry._id}
                      className="rounded-xl bg-gradient-to-br from-muted/50 to-muted/30 p-4 sm:p-5 shadow-[0_1px_0_0_rgba(255,255,255,0.1)_inset,0_4px_16px_rgba(0,0,0,0.08)]"
                    >
                      <div className="flex items-start gap-3 sm:gap-4">
                        {/* Avatar */}
                        <Avatar className="w-9 h-9 sm:w-10 sm:h-10 flex-shrink-0 shadow-[0_1px_0_0_rgba(255,255,255,0.1)_inset,0_2px_8px_rgba(0,0,0,0.1)]">
                          <AvatarImage src={entry.user.image} />
                          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                            {entry.user.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className="font-medium text-sm sm:text-base text-foreground">
                              {entry.user.name}
                            </span>
                            <Badge
                              variant="secondary"
                              className={`${config.bgColor} ${config.color} border-0 text-xs`}
                            >
                              <Icon className="w-3 h-3 mr-1" />
                              {config.label}
                            </Badge>
                            <code className="text-xs sm:text-sm bg-background/50 px-2 py-0.5 rounded font-mono">
                              {entry.variableKey}
                            </code>
                          </div>

                          <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-3 h-3" />
                              <span>
                                {formatDistanceToNow(
                                  new Date(entry.createdAt),
                                  {
                                    addSuffix: true,
                                  }
                                )}
                              </span>
                            </div>
                            <span>•</span>
                            <span>
                              {format(new Date(entry.createdAt), "h:mm a")}
                            </span>
                            {entry.metadata?.source && (
                              <>
                                <span>•</span>
                                <span className="capitalize">
                                  {entry.metadata.source}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
