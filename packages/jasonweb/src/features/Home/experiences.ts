export interface Tag {
  name: string;
  link: string;
}

const TypeScript: Tag = { name: 'TypeScript', link: 'https://www.typescriptlang.org/' };
const Node: Tag = { name: 'Node', link: 'https://nodejs.org/' };
const MongoDB: Tag = { name: 'MongoDB', link: 'https://www.mongodb.com/' };
const Kubernetes: Tag = { name: 'Kubernetes', link: 'https://kubernetes.io/' };
const Microservices: Tag = { name: 'Microservices', link: 'https://microservices.io/' };
const AWS: Tag = { name: 'AWS', link: 'https://aws.amazon.com/' };
const PubSub: Tag = { name: 'PubSub', link: 'https://aws.amazon.com/what-is/pub-sub-messaging/' };
const BullMQ: Tag = { name: 'BullMQ', link: 'https://docs.bullmq.io/' };
const RBAC: Tag = { name: 'RBAC', link: 'https://en.wikipedia.org/wiki/Role-based_access_control' };
const Angular: Tag = { name: 'Angular', link: 'https://angular.dev/' };

const GraphQL: Tag = { name: 'GraphQL', link: 'https://graphql.org/' };
const REST: Tag = { name: 'REST', link: 'https://en.wikipedia.org/wiki/REST' };
const AzureCloud: Tag = { name: 'Azure Cloud', link: 'https://azure.microsoft.com/' };
const AzureFunctions: Tag = {
  name: 'Azure Functions',
  link: 'https://azure.microsoft.com/en-us/products/functions',
};
const OracleDB: Tag = { name: 'OracleDB', link: 'https://www.oracle.com/database/' };
const PostgreSQL: Tag = { name: 'PostgreSQL', link: 'https://www.postgresql.org/' };
const React: Tag = { name: 'React', link: 'https://react.dev/' };

const CShrap: Tag = { name: 'C#', link: 'https://learn.microsoft.com/dotnet/csharp/' };
const DotNet: Tag = {
  name: '.NET Framework',
  link: 'https://dotnet.microsoft.com/learn/dotnet/what-is-dotnet-framework',
};

export interface ExperienceItem {
  start: Date;
  end?: Date;
  title: string;
  company: string;
  description: string;
  tags: Tag[];
}

export const experiences: ExperienceItem[] = [
  {
    start: new Date(2022, 10, 27),
    end: new Date(2024, 2, 1),
    title: 'Senior Full Stack Developer',
    company: 'Team Cymru',
    description:
      'Developed and maintained a cybersecurity attack surface management platform. Designed and implemented architectural solutions for role-based access control (RBAC), shared microservice libraries, graceful termination, error handling, and more',
    tags: [
      TypeScript,
      Node,
      MongoDB,
      Kubernetes,
      Microservices,
      AWS,
      PubSub,
      BullMQ,
      RBAC,
      Angular,
    ],
  },
  {
    start: new Date(2020, 2, 1),
    end: new Date(2022, 2, 1),
    title: 'Lead Full Stack Developer',
    company: 'IDF - C4I Corps (Mamram)',
    description:
      'Lead the development of a medical records system and an appointment scheduling system. Designed and implemented architectural solutions for systems with complex logical processes and high availability under heavy load, as well as serverless functions for integrations with external services.',
    tags: [
      TypeScript,
      Node,
      GraphQL,
      REST,
      AzureCloud,
      AzureFunctions,
      OracleDB,
      PostgreSQL,
      React,
    ],
  },
  {
    start: new Date(2019, 2, 1),
    end: new Date(2020, 2, 1),
    title: 'Junior Backend Developer',
    company: 'IDF - C4I Corps (Mamram)',
    description:
      'Developed a medical records system by replacing a legacy VBScript codebase with C#',
    tags: [CShrap, DotNet, OracleDB],
  },
];
