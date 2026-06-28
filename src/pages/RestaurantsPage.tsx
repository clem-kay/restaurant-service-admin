import { useState } from "react";
import { useRestaurants, useApproveRestaurant } from "@/hooks/restaurants/useRestaurants";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

const RestaurantsPage = () => {
    const [filterApproved, setFilterApproved] = useState<boolean | undefined>(undefined);
    const { data: restaurants, isLoading, isError } = useRestaurants({ isApproved: filterApproved });
    const { mutate: approveRestaurant, isPending } = useApproveRestaurant();

    return (
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold md:text-2xl">Restaurants</h1>
                <span className="text-sm text-muted-foreground">{restaurants?.length ?? 0} total</span>
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
                <div className="flex-1 flex items-center justify-center text-muted-foreground">Loading restaurants...</div>
            ) : isError ? (
                <div className="flex-1 flex items-center justify-center rounded-lg border border-dashed text-muted-foreground">
                    Failed to load restaurants.
                </div>
            ) : !restaurants || restaurants.length === 0 ? (
                <div className="flex-1 flex items-center justify-center rounded-lg border border-dashed">
                    <div className="text-center text-muted-foreground">No restaurants found.</div>
                </div>
            ) : (
                <div className="rounded-lg border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Address</TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead>Delivery Fee</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Open</TableHead>
                                <TableHead>Onboarding</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {restaurants.map((restaurant) => (
                                <TableRow key={restaurant.id}>
                                    <TableCell className="font-medium">{restaurant.name}</TableCell>
                                    <TableCell className="text-sm max-w-[180px] truncate">
                                        {restaurant.address}
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {restaurant.phone ?? "—"}
                                    </TableCell>
                                    <TableCell>GHS {restaurant.deliveryFee?.toFixed(2) ?? "—"}</TableCell>
                                    <TableCell>
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${restaurant.isApproved ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                                            {restaurant.isApproved ? "Approved" : "Pending"}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${restaurant.isOpen ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}>
                                            {restaurant.isOpen ? "Open" : "Closed"}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-xs text-muted-foreground capitalize">
                                        {restaurant.onboardingMethod?.toLowerCase().replace("_", " ")}
                                    </TableCell>
                                    <TableCell>
                                        {!restaurant.isApproved ? (
                                            <div className="flex gap-1">
                                                <Button
                                                    size="sm"
                                                    onClick={() => approveRestaurant({ id: restaurant.id, approve: true })}
                                                    disabled={isPending}
                                                >
                                                    Approve
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => approveRestaurant({ id: restaurant.id, approve: false })}
                                                    disabled={isPending}
                                                >
                                                    Reject
                                                </Button>
                                            </div>
                                        ) : (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => approveRestaurant({ id: restaurant.id, approve: false })}
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

export default RestaurantsPage;
