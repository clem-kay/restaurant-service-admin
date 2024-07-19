import React, {useEffect, useState} from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {useFieldArray, useForm, useWatch} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod";
import useInventoryStore from "@/store/useInventoryStore";
import useAddOrder, {CreateOrderData} from "@/hooks/order/useAddOrder";
import UseMenu from "@/hooks/menu/useMenu.ts";
import {DropdownMenuSeparator} from "@/components/ui/dropdown-menu.tsx";
import {formatCurrency} from "@/utils/utils.ts";
import toast from "react-hot-toast";
import {CURRENCY} from "@/constants/constants.ts";

// Define the schema using zod
const createOrderSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email"),
    number: z.string().min(1, "Number is required"),
    location: z.string().min(1, "Location is required"),
    other_info: z.string().optional(),
    pickup_status: z.enum(["PICKUP", "DELIVERY"]),
    orderItems: z.array(z.object({
        foodMenuId: z.number(),
        quantity: z.preprocess((val) => Number(val), z.number().min(1, "Quantity is required")),
    })),
});

type CreateOrderSchema = z.infer<typeof createOrderSchema>;

interface CreateOrderDialogProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
}

const CreateOrderDialog: React.FC<CreateOrderDialogProps> = ({
                                                                 isOpen,
                                                                 onOpenChange,
                                                             }) => {
    const {register, handleSubmit, formState: {errors}, reset, setValue, control} = useForm<CreateOrderSchema>({
        resolver: zodResolver(createOrderSchema),
        defaultValues: {
            name: '',
            email: '',
            number: '',
            location: '',
            other_info: '',
            pickup_status: 'PICKUP',
            orderItems: [{foodMenuId: 0, quantity: 1}],
        },
    });

    const menu = useInventoryStore(s => s.menu);
    const setMenu = useInventoryStore(s => s.setMenu);
    const {data: menuData} = UseMenu();
    const addOrder = useAddOrder();
    const {fields, append, remove} = useFieldArray({
        control,
        name: "orderItems"
    });

    const orderItems = useWatch({control, name: "orderItems"});

    const [totalAmount, setTotalAmount] = useState(0);

    useEffect(() => {
        if (menuData) {
            setMenu(menuData);
        }
    }, [menuData, setMenu]);

    useEffect(() => {
        const total = orderItems.reduce((sum, item) => {
            const menuItem = menu.find(menuItem => menuItem.id === item.foodMenuId);
            return sum + (menuItem ? menuItem.price * item.quantity : 0);
        }, 0);
        setTotalAmount(total);
    }, [orderItems, menu]);

    const handleFormSubmit = (data: CreateOrderSchema) => {
        // Set prices from menu for each order item
        const orderData: CreateOrderData = {
            order: {
                ...data,
                food_status: "PENDING",
                totalAmount
            },
            orderItems: data.orderItems.map(item => ({
                ...item,
                price: menu.find(menuItem => menuItem.id === item.foodMenuId)?.price || 0
            }))
        } as CreateOrderData;
        addOrder.mutate(orderData, {
                onSuccess: () => {
                    toast.success("Order Created Successfully");
                },
                onError: () => {
                    toast.error("Order Creation Failed");
                }
            }
        );
        reset();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[900px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create Order</DialogTitle>
                    <DialogDescription>
                        Create a new order.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(handleFormSubmit)}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="grid grid-cols-5 items-center gap-4">
                                <Label htmlFor="name" className="text-right">Name</Label>
                                <Input id="name" placeholder="Customer Name"
                                       className="col-span-4 bg-input" {...register("name")} />
                                {errors.name &&
                                    <p className="col-span-5 text-xs text-destructive">{errors.name.message}</p>}
                            </div>
                            <div className="grid grid-cols-5 items-center gap-4">
                                <Label htmlFor="email" className="text-right">Email</Label>
                                <Input id="email" placeholder="Email"
                                       className="col-span-4 bg-input" {...register("email")} />
                                {errors.email &&
                                    <p className="col-span-5 text-xs text-destructive">{errors.email.message}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="grid grid-cols-5 items-center gap-4">
                                <Label htmlFor="number" className="text-right">Contact</Label>
                                <Input id="number" placeholder="Contact Number"
                                       className="col-span-4 bg-input" {...register("number")} />
                                {errors.number &&
                                    <p className="col-span-5 text-xs text-destructive">{errors.number.message}</p>}
                            </div>
                            <div className="grid grid-cols-5 items-center gap-4">
                                <Label htmlFor="location" className="text-right">Location</Label>
                                <Input id="location" placeholder="Location"
                                       className="col-span-4 bg-input" {...register("location")} />
                                {errors.location &&
                                    <p className="col-span-5 text-xs text-destructive">{errors.location.message}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="grid grid-cols-5 items-center gap-4">
                                <Label htmlFor="other_info" className="text-right">Other Info</Label>
                                <Textarea id="other_info" placeholder="Additional Info"
                                          className="col-span-4 bg-input" {...register("other_info")} />
                                {errors.other_info &&
                                    <p className="col-span-5 text-xs text-destructive">{errors.other_info.message}</p>}
                            </div>
                            <div className="grid grid-cols-5 items-center gap-4">
                                <Label htmlFor="pickup_status" className="text-right">Pickup Status</Label>
                                <Select
                                    onValueChange={(value) => setValue("pickup_status", value as "DELIVERY" | "PICKUP")}
                                    defaultValue="PICKUP">
                                    <SelectTrigger className="col-span-4 bg-input">
                                        <SelectValue placeholder="Select Pickup Status"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Status</SelectLabel>
                                            <SelectItem value="PICKUP">PICKUP</SelectItem>
                                            <SelectItem value="DELIVERY">DELIVERY</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                {errors.pickup_status &&
                                    <p className="col-span-5 text-xs text-destructive">{errors.pickup_status.message}</p>}
                            </div>
                        </div>


                        <DropdownMenuSeparator/>
                        <div className="grid gap-4 py-4">
                            <Label className="text-left text-lg">Order Items</Label>
                            {fields.map((field, index) => (
                                <div key={field.id} className="grid grid-cols-1 md:grid-cols-5 items-center gap-4">
                                    <div className="col-span-1 md:col-span-2">
                                        <Label htmlFor={`orderItems.${index}.foodMenuId`} className="block py-2">Food
                                            Menu</Label>
                                        <Select
                                            onValueChange={(value) => setValue(`orderItems.${index}.foodMenuId`, parseInt(value))}
                                            defaultValue={field.foodMenuId.toString()}>
                                            <SelectTrigger className="w-full bg-input">
                                                <SelectValue placeholder="Select Food Menu"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Menu</SelectLabel>
                                                    <DropdownMenuSeparator/>
                                                    {menu.map((item) => (
                                                        <SelectItem key={item.id}
                                                                    className='hover:bg-accent hover:text-white'
                                                                    value={item.id.toString()}>{item.name}</SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="col-span-1 md:col-span-2">
                                        <Label htmlFor={`orderItems.${index}.quantity`}
                                               className="block py-2">Quantity</Label>
                                        <Input type="number" placeholder="Quantity"
                                               className="w-full bg-input" {...register(`orderItems.${index}.quantity` as const)} />
                                    </div>
                                    <div className="col-span-1 md:col-span-1 flex items-end">
                                        <Button type="button" variant="destructive" className='relative top-3'
                                                onClick={() => remove(index)}>Remove</Button>

                                    </div>

                                    <DropdownMenuSeparator className='my-4'/>
                                    {errors.orderItems?.[index] && (
                                        <p className="col-span-5 text-xs text-destructive">
                                            {errors.orderItems[index]?.foodMenuId?.message || errors.orderItems[index]?.quantity?.message}
                                        </p>
                                    )}

                                </div>
                            ))}
                        </div>

                        <Button type="button" className='w-full' onClick={() => append({foodMenuId: 0, quantity: 1})}>Add
                            Item</Button>

                        <DropdownMenuSeparator className='my-4'/>
                        <div className='flex justify-end items-end '>
                            <div className="grid grid-cols-5 items-center gap-4 ">
                                <Label htmlFor="totalAmount" className="text-right">Total Amount</Label>
                                <div id="totalAmount"
                                     className="col-span-4 rounded-lg bg-input p-2 border-[3.5px] border-muted">{CURRENCY}{" "}{formatCurrency(totalAmount)}</div>
                            </div>
                        </div>
                    </div>

                    <DropdownMenuSeparator className='my-4 mb-8'/>
                    <DialogFooter>
                        <Button type="submit">Create</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateOrderDialog;
