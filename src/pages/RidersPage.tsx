import { useState } from "react";
import { useRiders, useApproveRider } from "@/hooks/riders/useRiders";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

const RidersPage = () => {
    const [filterApproved, setFilterApproved] = useState<boolean | undefined>(undefined);
    const { data: riders, isLoading, isError } = useRiders({ isApproved: filterApproved });
    const { mutate: approveRider, isPending } = useApproveRider();

    return (
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold md:text-2xl">Riders</h1>
                <span className="text-sm text-muted-foreground">{riders?.length ?? 0} total</span>
            </div>

            <div className="flex gap-2">
                <Button
                    variant={filterApproved === undefined ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterApproved(undefined)}
                >
                    All
                </Button>
                <Button
                    variant={filterApproved === false ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterApproved(false)}
                >
                    Pending Approval
                </Button>
                <Button
                    variant={filterApproved === true ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterApproved(true)}
                >
                    Approved
                </Button>
            </div>

            {isLoading ? (
                <div className="flex-1 flex items-center justify-center text-muted-foreground">Loading riders...</div>
            ) : isError ? (
                <div className="flex-1 flex items-center justify-center rounded-lg border border-dashed text-muted-foreground">
                    Failed to load riders.
                </div>
            ) : !riders || riders.length === 0 ? (
                <div className="flex-1 flex items-center justify-center rounded-lg border border-dashed">
                    <div className="text-center text-muted-foreground">No riders found.</div>
                </div>
            ) : (
                <div className="rounded-lg border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead>Vehicle</TableHead>
                                <TableHead>Plate</TableHead>
                                <TableHead>Earnings</TableHead>
                                <TableHead>Availability</TableHead>
                                <TableHead>Approval</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {riders.map((rider) => (
                                <TableRow key={rider.id}>
                                    <TableCell className="font-medium">
                                        {rider.firstName} {rider.lastName}
                                    </TableCell>
                                    <TableCell>{rider.phone}</TableCell>
                                    <TableCell className="text-sm">{rider.vehicleType}</TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {rider.vehiclePlate ?? "—"}
                                    </TableCell>
                                    <TableCell>GHS {rider.totalEarnings?.toFixed(2) ?? "0.00"}</TableCell>
                                    <TableCell>
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${rider.isAvailable ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}>
                                            {rider.isAvailable ? "Available" : "Unavailable"}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${rider.isApproved ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                                            {rider.isApproved ? "Approved" : "Pending"}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        {!rider.isApproved ? (
                                            <Button
                                                size="sm"
                                                onClick={() => approveRider({ id: rider.id, approve: true })}
                                                disabled={isPending}
                                            >
                                                Approve
                                            </Button>
                                        ) : (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => approveRider({ id: rider.id, approve: false })}
                                                disabled={isPending}
                                            >
                                                Revoke
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </main>
    );
};

export default RidersPage;
