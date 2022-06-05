import fs from "fs-extra";

type ProjectsType = {
  Id: string;
  Name: string;
}[];
type EnvironmentsType = {
  Id: string;
  Name: string;
}[];
type DeploymentsType = {
  Id: string;
  ReleaseId: string;
  EnvironmentId: string;
  DeployedAt: string;
}[];
type ReleasesType = {
  Id: string;
  ProjectId: string;
  Version: string | null;
  Created: string;
}[];

type RetentionType = {
  [key: string]: {
    ProjectId: string;
    EnvironmentId: string;
    ReleaseId: string;
    DeploymentId: string;
    DeployedAt: string;
  }[];
};

export const getReleaseRetention = (
  Projects: ProjectsType,
  Environments: EnvironmentsType,
  Deployments: DeploymentsType,
  Releases: ReleasesType,
  n: number
) => {
  const projectIds = Projects.map((project) => project.Id);
  const environmentIds = Environments.map((env) => env.Id);

  // Replenish Deployments with ProjectId for future consuming
  const replenishDeployments = Deployments.map((deployment) => {
    const ProjectId =
      Releases.find((release) => release.Id === deployment.ReleaseId)
        ?.ProjectId ?? null;
    return {
      ...deployment,
      ProjectId,
    };
  }).sort(
    (d1, d2) =>
      Number(new Date(d1.DeployedAt)) - Number(new Date(d2.DeployedAt))
  );

  let result: RetentionType = {};
  replenishDeployments.forEach((item) => {
    for (const projectId of projectIds) {
      for (const envId of environmentIds) {
        if (item.ProjectId === projectId && item.EnvironmentId === envId) {
          if (result[`${projectId} - ${envId}`]?.length >= n) return;
          result[`${projectId} - ${envId}`] = [
            ...(result?.[`${projectId} - ${envId}`] ?? []),
            {
              ProjectId: item.ProjectId,
              EnvironmentId: item.EnvironmentId,
              ReleaseId: item.ReleaseId,
              DeploymentId: item.Id,
              DeployedAt: item.DeployedAt,
            },
          ];
        }
      }
    }
  });

  return result;
};

export const output = (
  retainedRelease: RetentionType,
  pathRetention: string,
  pathLog: string
) => {
  if (!retainedRelease || !pathRetention || !pathLog) return;

  // RetainedRelease.json contains structured retention information might be consumed by some automatic tools.
  fs.outputFileSync(pathRetention, JSON.stringify(retainedRelease));

  // verbose log
  fs.outputFileSync(pathLog, "");
  for (const [key, value] of Object.entries(retainedRelease)) {
    fs.appendFileSync(pathLog, `${key}: \n`);
    for (const el of value) {
      fs.appendFileSync(
        pathLog,
        `\t${el.ReleaseId} kept because it was the most recently deployed to ${el.EnvironmentId}\n`
      );
    }
  }
};
