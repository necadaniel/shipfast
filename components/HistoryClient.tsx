"use client";

import React from "react";
import Link from "next/link";
import { Clock, FileText, FolderOpen, History } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Project {
  _id: string;
  name: string;
  description?: string;
  color: string;
  variableCount: number;
  isTeamProject?: boolean;
  teamId?: string;
  historyCount: number;
  lastChangeAt: Date | null;
}

interface HistoryClientProps {
  projects: Project[];
}

export default function HistoryClient({ projects }: HistoryClientProps) {
  if (projects.length === 0) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1 sm:mb-2">
            Change History
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Track all changes made to your environment variables
          </p>
        </div>

        {/* Empty State */}
        <div className="flex items-center justify-center min-h-[calc(100vh-12rem)] px-4">
          <div className="max-w-md w-full">
            <div className="rounded-2xl bg-gradient-to-br from-muted/50 to-muted/30 p-8 sm:p-12 text-center shadow-[0_1px_0_0_rgba(255,255,255,0.1)_inset,0_8px_32px_rgba(0,0,0,0.08)]">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-[0_1px_0_0_rgba(255,255,255,0.1)_inset,0_4px_16px_rgba(0,0,0,0.05)]">
                <History className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2 sm:mb-3">
                No History Yet
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8">
                Start making changes to your projects to see version history
                here. Every variable you create, update, or delete will be
                tracked.
              </p>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium shadow-[0_1px_0_0_rgba(255,255,255,0.25)_inset,0_4px_16px_rgba(0,0,0,0.15)] hover:shadow-[0_1px_0_0_rgba(255,255,255,0.25)_inset,0_6px_20px_rgba(0,0,0,0.2)] hover:translate-y-[-2px] transition-all"
              >
                <FolderOpen className="w-4 h-4" />
                Go to Projects
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Page Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1 sm:mb-2">
          Change History
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Track all changes made to your environment variables
        </p>
      </div>

      {/* Projects Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Link
            key={project._id}
            href={`/dashboard/history/${project._id}`}
            className="group h-full"
          >
            <div className="relative rounded-xl bg-gradient-to-br from-muted/50 to-muted/30 p-4 sm:p-6 transition-all hover:shadow-[0_1px_0_0_rgba(255,255,255,0.1)_inset,0_12px_40px_rgba(0,0,0,0.12)] hover:translate-y-[-2px] shadow-[0_1px_0_0_rgba(255,255,255,0.1)_inset,0_8px_32px_rgba(0,0,0,0.08)] active:scale-[0.98] cursor-pointer h-full flex flex-col">
              {/* Color indicator */}
              <div
                className="absolute top-0 left-0 w-1 h-full rounded-l-xl"
                style={{ backgroundColor: project.color }}
              />

              {/* Header */}
              <div className="flex items-start justify-between mb-3 sm:mb-4">
                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                  <div
                    className="w-9 sm:w-10 h-9 sm:h-10 rounded-lg flex items-center justify-center shadow-[0_1px_0_0_rgba(255,255,255,0.1)_inset,0_2px_8px_rgba(0,0,0,0.1)] flex-shrink-0"
                    style={{ backgroundColor: `${project.color}20` }}
                  >
                    <Clock
                      className="w-4 sm:w-5 h-4 sm:h-5"
                      style={{ color: project.color }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm sm:text-base font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                      {project.name}
                    </h3>
                    {project.isTeamProject && (
                      <span className="inline-flex items-center gap-1 text-xs text-primary/80 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                        Team
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="flex-1 mb-3 sm:mb-4 min-h-[2.5rem]">
                {project.description && (
                  <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                    {project.description}
                  </p>
                )}
              </div>

              {/* Stats */}
              <div className="flex items-center flex-wrap gap-3 sm:gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <History className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
                  <span>
                    {project.historyCount}{" "}
                    {project.historyCount === 1 ? "change" : "changes"}
                  </span>
                </div>
                {project.lastChangeAt && (
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
                    <span>
                      {formatDistanceToNow(new Date(project.lastChangeAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
