import Projects from "../mockData/Projects.json";
import Environments from "../mockData/Environments.json";
import Deployments from "../mockData/Deployments.json";
import Releases from "../mockData/Releases.json";

import { getReleaseRetention } from "./core";

const N = 2;
const retainedRelease = getReleaseRetention(
  Projects,
  Environments,
  Deployments,
  Releases,
  N
);
console.log(retainedRelease);

it("should contain all combinations of Projects and Environments", () => {
  expect(retainedRelease).toHaveProperty("Project-1 - Environment-1");
  expect(retainedRelease).toHaveProperty("Project-1 - Environment-2");
  expect(retainedRelease).toHaveProperty("Project-2 - Environment-1");
  expect(retainedRelease).toHaveProperty("Project-2 - Environment-2");
});

it("should contain kept release IDs", () => {
  expect(retainedRelease["Project-1 - Environment-1"]).toMatchObject([
    {
      ProjectId: "Project-1",
      EnvironmentId: "Environment-1",
      ReleaseId: "Release-1",
      DeploymentId: "Deployment-1",
      DeployedAt: "2000-01-01T10:00:00",
    },
    {
      ProjectId: "Project-1",
      EnvironmentId: "Environment-1",
      ReleaseId: "Release-2",
      DeploymentId: "Deployment-2",
      DeployedAt: "2000-01-02T10:00:00",
    },
  ]);

  expect(retainedRelease["Project-2 - Environment-1"]).toMatchObject([
    {
      ProjectId: "Project-2",
      EnvironmentId: "Environment-1",
      ReleaseId: "Release-5",
      DeploymentId: "Deployment-5",
      DeployedAt: "2000-01-01T11:00:00",
    },
    {
      ProjectId: "Project-2",
      EnvironmentId: "Environment-1",
      ReleaseId: "Release-6",
      DeploymentId: "Deployment-6",
      DeployedAt: "2000-01-02T10:00:00",
    },
  ]);
  expect(retainedRelease["Project-1 - Environment-2"]).toMatchObject([
    {
      ProjectId: "Project-1",
      EnvironmentId: "Environment-2",
      ReleaseId: "Release-1",
      DeploymentId: "Deployment-3",
      DeployedAt: "2000-01-02T11:00:00",
    },
  ]);
  expect(retainedRelease["Project-2 - Environment-2"]).toMatchObject([
    {
      ProjectId: "Project-2",
      EnvironmentId: "Environment-2",
      ReleaseId: "Release-6",
      DeploymentId: "Deployment-7",
      DeployedAt: "2000-01-02T11:00:00",
    },
  ]);
});

it("should no more than N records", () => {
  for (const [key, value] of Object.entries(retainedRelease)) {
    expect(value.length).toBeLessThanOrEqual(N);
  }
});

it.only("should be sorted in most recent deployed order", () => {
  expect(retainedRelease["Project-1 - Environment-1"][0]).toMatchObject({
    ReleaseId: "Release-1",
    DeployedAt: "2000-01-01T10:00:00",
  });
  expect(retainedRelease["Project-1 - Environment-1"][1]).toMatchObject({
    ReleaseId: "Release-2",
    DeployedAt: "2000-01-02T10:00:00",
  });
  expect(retainedRelease["Project-2 - Environment-1"][0]).toMatchObject({
    ReleaseId: "Release-5",
    DeployedAt: "2000-01-01T11:00:00",
  });
  expect(retainedRelease["Project-2 - Environment-1"][1]).toMatchObject({
    ReleaseId: "Release-6",
    DeployedAt: "2000-01-02T10:00:00",
  });
});
