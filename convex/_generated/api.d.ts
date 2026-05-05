/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as aiAnalysis from "../aiAnalysis.js";
import type * as aiProviderKeyActions from "../aiProviderKeyActions.js";
import type * as aiProviderSettings from "../aiProviderSettings.js";
import type * as aiProviderSettingsInternal from "../aiProviderSettingsInternal.js";
import type * as artifacts from "../artifacts.js";
import type * as events from "../events.js";
import type * as feedback from "../feedback.js";
import type * as lib from "../lib.js";
import type * as projects from "../projects.js";
import type * as users from "../users.js";
import type * as workflowRuns from "../workflowRuns.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  aiAnalysis: typeof aiAnalysis;
  aiProviderKeyActions: typeof aiProviderKeyActions;
  aiProviderSettings: typeof aiProviderSettings;
  aiProviderSettingsInternal: typeof aiProviderSettingsInternal;
  artifacts: typeof artifacts;
  events: typeof events;
  feedback: typeof feedback;
  lib: typeof lib;
  projects: typeof projects;
  users: typeof users;
  workflowRuns: typeof workflowRuns;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
