import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRestaurants, useApproveRestaurant, useCreateRestaurant, CreateRestaurantDto } from "@/hooks/restaurants/useRestaurants";
import useRestaurantStore from "@/store/useRestaurantStore";
import { Button } from "@/components/ui/button";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, LogIn } from "lucide-react";

const defaultForm: CreateRestaurantDto = {
    name: "",
    address: "",
    latitude: 0,
    longitude: 0,
    phone: "",
    email: "",
    deliveryFee: 0,
    estimatedMinutes: 30,
    description: "",
    adminUsername: "",
    adminPassword: "",
};

const RestaurantsPage = () => {
    const navigate = useNavigate();
    const [filterApproved, setFilterApproved] = useState<boolean | undefined>(undefined);
    const [createOpen, setCreateOpen] = useState(false);
    const [form, setForm] = useState<CreateRestaurantDto>(defaultForm);

    const { data: restaurants, isLoading, isError } = useRestaurants({ isApproved: filterApproved });
    const { mutate: approveRestaurant, isPending } = useApproveRestaurant();
    const { mutate: createRestaurant, isPending: isCreating } = useCreateRestaurant();
    const setSelectedRestaurant = useRestaurantStore((s) => s.setSelectedRestaurant);

    const handleEnter = (restaurant: NonNullable<typeof restaurants>[number]) => {
        setSelectedRestaurant(restaurant);
        navigate("/admin/dashboard");
    };

    const handleCreate = () => {
        createRestaurant(form, {
            onSuccess: () => {
                setCreateOpen(false);
                setForm(defaultForm);
            },
        });
    };

    const field = (key: keyof CreateRestaurantDto, label: string, type = "text", placeholder = "") => (
        <div className="grid gap-1.5">
            <Label htmlFor={key}>{label}</Label>
            <Input
                id={key}
                type={type}
                placeholder={placeholder}
                value={String(form[key] ?? "")}
                onChange={(e) => setForm((prev) => ({ ...prev, [key]: type === "number" ? +e.target.value : e.target.value }))}
            />
        </div>
    );

    return (
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                    <h1 className="text-lg font-semibold md:text-2xl">Restaurants</h1>
                    <span className="text-sm text-muted-foreground">{restaurants?.length ?? 0} total</span>
                </div>
                <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                    <DialogTrigger asChild>
                        <Button size="sm" className="gap-1.5">
                            <PlusCircle className="h-4 w-4" />
                            Create Restaurant
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Create Restaurant</DialogTitle>
                            <DialogDescription>
                                Manually onboard a new restaurant. An admin account will be created.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-3 py-2">
                            {field("name", "Restaurant Name", "text", "Jollof Palace")}
                            {field("address", "Address", "text", "12 High St, Accra")}
                            {field("latitude", "Latitude", "number", "5.6037")}
                            {field("longitude", "Longitude", "number", "-0.1870")}
                            {field("phone", "Phone", "text", "+233...")}
                            {field("email", "Email", "email", "info@restaurant.com")}
                            {field("deliveryFee", "Delivery Fee (GHS)", "number", "5")}
                            {field("estimatedMinutes", "Est. Delivery (min)", "number", "30")}
                            {field("description", "Description", "text", "Short description")}
                            <div className="border-t pt-3 mt-1">
                                <p className="text-xs text-muted-foreground mb-2">Admin account credentials</p>
                                {field("adminUsername", "Admin Username", "text", "admin.restaurantname")}
                                {field("adminPassword", "Admin Password", "password", "")}
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
                            <Button onClick={handleCreate} disabled={isCreating}>
                                {isCreating ? "Creating..." : "Create"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="flex gap-2 flex-wrap">
                <Button variant={filterApproved === undefined ? "default" : "outline"} size="sm" onClick={() => setFilterApproved(undefined)}>
                    All
                </Button>
                <Button variant={filterApproved === false ? "default" : "outline"} size="sm" onClick={() => setFilterApproved(false)}>
                    Pending Approval
                </Button>
                <Button variant={filterApproved === true ? "default" : "outline"} size="sm" onClick={() => setFilterApproved(true)}>
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
                <div className="rounded-lg border overflow-x-auto">
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
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {restaurants.map((restaurant) => (
                                <TableRow key={restaurant.id}>
                                    <TableCell className="font-medium whitespace-nowrap">{restaurant.name}</TableCell>
                                    <TableCell className="text-sm max-w-[160px] truncate">{restaurant.address}</TableCell>
                                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">{restaurant.phone ?? "—"}</TableCell>
                                    <TableCell className="whitespace-nowrap">GHS {restaurant.deliveryFee?.toFixed(2) ?? "—"}</TableCell>
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
                                    <TableCell className="text-xs text-muted-foreground capitalize whitespace-nowrap">
                                        {restaurant.onboardingMethod?.toLowerCase().replace("_", " ")}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-1 flex-wrap">
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                className="gap-1"
                                                onClick={() => handleEnter(restaurant)}
                                            >
                                                <LogIn className="h-3.5 w-3.5" />
                                                Enter
                                            </Button>
                                            {!restaurant.isApproved ? (
                                                <>
                                                    <Button size="sm" onClick={() => approveRestaurant({ id: restaurant.id, approve: true })} disabled={isPending}>
                                                        Approve
                                                    </Button>
                                                    <Button size="sm" variant="destructive" onClick={() => approveRestaurant({ id: restaurant.id, approve: false })} disabled={isPending}>
                                                        Reject
                                                    </Button>
                                                </>
                                            ) : (
                                                <Button size="sm" variant="outline" onClick={() => approveRestaurant({ id: restaurant.id, approve: false })} disabled={isPending}>
                                                    Revoke
                                                </Button>
                                            )}
                                        </div>
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
