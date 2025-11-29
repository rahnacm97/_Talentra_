
// import { CandidateJobService } from "./server/src/services/job/job.service";
// import { IJobRepository } from "./server/src/interfaces/jobs/IJobRepository";
// import { ICandidateRepo } from "./server/src/interfaces/users/candidate/ICandidateRepository";
// import { IJobMapper } from "./server/src/interfaces/jobs/IJobMapper";
// import { IApplicationRepository } from "./server/src/interfaces/applications/IApplicationRepository";
// import { IJob } from "./server/src/interfaces/jobs/IJob";

// // Mock dependencies
// const mockJobRepo = {} as IJobRepository;
// const mockAppRepo = {} as IApplicationRepository;

// const mockMapper: IJobMapper = {
//     toResponseDto: (job: any) => job,
//     toResponseDtoList: (jobs: any[]) => jobs,
// } as any;

// const mockSavedJobs: IJob[] = [
//     { _id: "1", title: "Frontend Developer", location: "New York", type: "Full-time", employerId: { companyName: "Tech Corp" } } as any,
//     { _id: "2", title: "Backend Developer", location: "San Francisco", type: "Full-time", employerId: { companyName: "Data Inc" } } as any,
//     { _id: "3", title: "Designer", location: "Remote", type: "Contract", employerId: { companyName: "Design Studio" } } as any,
// ];

// const mockCandRepo: ICandidateRepo = {
//     getSavedJobs: async (id: string) => {
//         console.log(`Mock Repo: Fetching saved jobs for ${id}`);
//         return mockSavedJobs;
//     },
// } as any;

// async function runVerification() {
//     const service = new CandidateJobService(mockJobRepo, mockCandRepo, mockMapper, mockAppRepo);

//     console.log("--- Test 1: Get all saved jobs ---");
//     const result1 = await service.getSavedJobs("cand1");
//     console.log(`Total: ${result1.total}, Expected: 3`);
//     console.log(`Jobs: ${result1.jobs.length}, Expected: 3`);

//     console.log("\n--- Test 2: Search 'Developer' ---");
//     const result2 = await service.getSavedJobs("cand1", { search: "Developer" });
//     console.log(`Total: ${result2.total}, Expected: 2`);
//     console.log(`Jobs: ${result2.jobs.map(j => j.title).join(", ")}`);

//     console.log("\n--- Test 3: Filter Type 'Contract' ---");
//     const result3 = await service.getSavedJobs("cand1", { type: "Contract" });
//     console.log(`Total: ${result3.total}, Expected: 1`);
//     console.log(`Jobs: ${result3.jobs.map(j => j.title).join(", ")}`);

//     console.log("\n--- Test 4: Pagination (Page 1, Limit 2) ---");
//     const result4 = await service.getSavedJobs("cand1", { page: 1, limit: 2 });
//     console.log(`Total: ${result4.total}, Expected: 3 (Total count should be unaffected by pagination slice)`);
//     console.log(`Returned Jobs: ${result4.jobs.length}, Expected: 2`);
//     console.log(`Page: ${result4.page}, Limit: ${result4.limit}`);

//     console.log("\n--- Test 5: Pagination (Page 2, Limit 2) ---");
//     const result5 = await service.getSavedJobs("cand1", { page: 2, limit: 2 });
//     console.log(`Returned Jobs: ${result5.jobs.length}, Expected: 1`);
//     console.log(`Jobs: ${result5.jobs.map(j => j.title).join(", ")}`);
// }

// runVerification().catch(console.error);
