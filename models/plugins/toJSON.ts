import type { Schema } from "mongoose";

/**
 * Mongoose schema plugin applied in the toJSON transform:
 *  - removes __v
 *  - replaces _id with id
 *  - removes any path declared with `private: true`
 *
 * This keeps internal fields out of API responses by default, so you have to
 * opt in to exposing something rather than remember to hide it.
 */

type PlainObject = Record<string, unknown>;

const deleteAtPath = (obj: PlainObject, path: string[], index: number) => {
  const key = path[index];

  if (index === path.length - 1) {
    delete obj[key];
    return;
  }

  const next = obj[key];
  if (next && typeof next === "object") {
    deleteAtPath(next as PlainObject, path, index + 1);
  }
};

const toJSON = (schema: Schema) => {
  schema.set("toJSON", {
    transform(_doc, ret: PlainObject) {
      Object.keys(schema.paths).forEach((path) => {
        const options = schema.paths[path]?.options;
        if (options?.private) {
          deleteAtPath(ret, path.split("."), 0);
        }
      });

      if (ret._id) {
        ret.id = String(ret._id);
      }
      delete ret._id;
      delete ret.__v;
    },
  });
};

export default toJSON;
