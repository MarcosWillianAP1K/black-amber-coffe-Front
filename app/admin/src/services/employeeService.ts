/**
 * Employee Service — Data access layer for staff/employees.
 *
 * Integrated with backend /api/admin/workers endpoints.
 */

import type { Worker, WorkerUpdateInput } from "shared-utils/types/worker";
import { MOCK_WORKERS } from "shared-utils/MockBD.js";
import { authFetch } from "./httpClient.ts";
import { API } from "shared-utils/core/APIroutes";

// Mock toggle — set to false to use real API
const USE_MOCK = false;

let nextId = 11;
let employees = [...MOCK_WORKERS];

// ──────────────────────────────────────────────
// Types for API responses
// ──────────────────────────────────────────────

interface AdminWorkersListResponse {
    data: Worker[];
}

interface AdminWorkerResponse {
    data: Worker;
}

interface AdminWorkerResponseWithMessage {
    data: Worker;
    message?: string;
}

// ──────────────────────────────────────────────
// Service functions
// ──────────────────────────────────────────────

/** Fetch all employees */
export async function fetchEmployees(): Promise<Worker[]> {
    if (USE_MOCK) {
        return [...employees];
    }

    const response = await authFetch(API.AdminWorkers.List, {
        method: "GET",
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch employees: ${response.status}`);
    }

    const payload = (await response.json()) as AdminWorkersListResponse;
    return payload.data;
}

/** Create a new employee */
export async function createEmployee(data: {
    fullName: string;
    email: string;
    password: string;
    phone?: string;
    role: Worker["role"];
    salary: number;
}): Promise<Worker> {
    if (USE_MOCK) {
        const now = new Date().toISOString();
        const newEmployee: Worker = {
            publicId: String(nextId++),
            role: data.role,
            salary: data.salary,
            isActive: true,
            profile: {
                fullName: data.fullName,
                phone: data.phone ?? null,
                avatarImage: null,
                email: data.email,
                createdAt: now,
                updatedAt: now,
            },
            createdAt: now,
            updatedAt: now,
        };
        employees = [...employees, newEmployee];
        return newEmployee;
    }

    const response = await authFetch(API.AdminWorkers.Register, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            fullName: data.fullName,
            email: data.email,
            password: data.password,
            phone: data.phone,
            role: data.role,
            salary: data.salary,
        }),
    });

    if (!response.ok) {
        throw new Error(`Failed to create employee: ${response.status}`);
    }

    const payload = (await response.json()) as AdminWorkerResponse;

    // Map from RegisterWorkerResponse shape to Worker
    const { data: workerData } = payload;
    const worker: Worker = {
        publicId: workerData.publicId,
        role: workerData.role as Worker["role"],
        salary: workerData.salary,
        isActive: true,
        profile: {
            fullName: workerData.profile.fullName,
            phone: workerData.profile.phone ?? null,
            avatarImage: workerData.profile.avatarImage ?? null,
            email: workerData.profile.email,
            createdAt: workerData.profile.createdAt,
            updatedAt: workerData.profile.updatedAt,
        },
        createdAt: workerData.createdAt,
        updatedAt: workerData.updatedAt,
    };

    return worker;
}

/** Update an existing employee */
export async function updateEmployee(publicId: string, updates: Partial<WorkerUpdateInput>): Promise<Worker> {
    if (USE_MOCK) {
        const now = new Date().toISOString();
        employees = employees.map((e) =>
            e.publicId === publicId
                ? {
                    ...e,
                    profile: {
                        ...e.profile,
                        fullName: updates.fullName ?? e.profile.fullName,
                        email: updates.email ?? e.profile.email,
                        phone: updates.phone ?? e.profile.phone,
                        updatedAt: now,
                    },
                    updatedAt: now,
                }
                : e
        );
        const updated = employees.find((e) => e.publicId === publicId);
        if (!updated) throw new Error(`Employee ${publicId} not found`);
        return updated;
    }

    const response = await authFetch(API.AdminWorkers.UpdateById(publicId), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
    });

    if (!response.ok) {
        throw new Error(`Failed to update employee: ${response.status}`);
    }

    const payload = (await response.json()) as AdminWorkerResponseWithMessage;
    return payload.data;
}

/** Toggle employee active/inactive status */
export async function toggleEmployeeStatus(publicId: string): Promise<Worker> {
    if (USE_MOCK) {
        const employee = employees.find((e) => e.publicId === publicId);
        if (!employee) throw new Error(`Employee ${publicId} not found`);
        const now = new Date().toISOString();
        employees = employees.map((e) =>
            e.publicId === publicId ? { ...e, isActive: !e.isActive, updatedAt: now } : e
        );
        const updated = employees.find((e) => e.publicId === publicId);
        if (!updated) throw new Error(`Employee ${publicId} not found`);
        return updated;
    }

    // NOTE: No API endpoint exists to toggle worker isActive.
    // Backend's updateWorkerSchema has no isActive field.
    throw new Error("toggleEmployeeStatus is not available via API — mock only");
}

/** Delete an employee */
export async function deleteEmployee(publicId: string): Promise<void> {
    if (USE_MOCK) {
        employees = employees.filter((e) => e.publicId !== publicId);
        return;
    }

    const response = await authFetch(API.AdminWorkers.DeleteById(publicId), {
        method: "DELETE",
    });

    // Backend returns 204 for delete, so ok status is 204
    if (response.status !== 204) {
        throw new Error(`Failed to delete employee: ${response.status}`);
    }
}
