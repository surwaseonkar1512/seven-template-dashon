import React, { useEffect, useState } from "react";
import {
    Plus,
    Edit,
    Trash2,
    Star,
    ImagePlus,
    Eye,
    EyeOff,
    AlertTriangle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "../../components/ui/dialog";
import Loading from "../ui/Loading";

import {
    getTestimonials,
    addTestimonial,
    updateTestimonial,
    deleteTestimonial,
} from "../../../Services/Homepage";

interface Testimonial {
    _id?: string;
    name: string;
    role: string;
    review: string;
    rating: number;
    imageUrl?: string;
    domainUrl?: string;
    isActive?: boolean;
}

const TestimonialSection: React.FC<{ userId: any }> = ({ userId }) => {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [editingTestimonial, setEditingTestimonial] =
        useState<Testimonial | null>(null);
    const [openForm, setOpenForm] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [rating, setRating] = useState<number>(0);
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<Testimonial | null>(null);

    // 🔹 Load testimonials
    const loadTestimonials = async () => {
        setLoading(true);
        try {
            const res = await getTestimonials(userId);
            setTestimonials(res);
        } catch (err) {
            console.error("Error loading testimonials:", err);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadTestimonials();
    }, []);

    // 🔹 Image preview
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) setImagePreview(URL.createObjectURL(file));
    };

    // 🔹 Add / Update
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const data = new FormData(form);
        data.append("userId", userId);
        data.append("rating", rating.toString());

        setSubmitting(true);
        try {
            if (editingTestimonial?._id) {
                await updateTestimonial(editingTestimonial._id, data);
            } else {
                await addTestimonial(data);
            }
            setOpenForm(false);
            setEditingTestimonial(null);
            setImagePreview(null);
            loadTestimonials();
        } catch (err) {
            console.error("Error saving testimonial:", err);
        }
        setSubmitting(false);
    };

    // 🔹 Delete
    const confirmDelete = (t: Testimonial) => {
        setDeleteTarget(t);
        setConfirmDeleteOpen(true);
    };

    const handleDeleteConfirmed = async () => {
        if (!deleteTarget?._id) return;
        setLoading(true);
        try {
            await deleteTestimonial(deleteTarget._id);
            setConfirmDeleteOpen(false);
            setDeleteTarget(null);
            loadTestimonials();
        } catch (err) {
            console.error("Error deleting testimonial:", err);
        }
        setLoading(false);
    };

    // 🔹 Toggle active/inactive
    const handleToggleActive = async (t: Testimonial) => {
        try {
            const data = new FormData();
            data.append("isActive", (!t.isActive).toString());
            await updateTestimonial(t._id!, data);
            loadTestimonials();
        } catch (err) {
            console.error("Error toggling testimonial active state:", err);
        }
    };

    return (
        <div className="flex flex-col h-full bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b flex justify-between items-center bg-gradient-to-r from-emerald-50 to-cyan-50">
                <div>
                    <h3 className="text-2xl font-bold text-gray-800">Testimonials</h3>
                    <p className="text-gray-500 text-sm mt-1">
                        Manage client feedback and ratings for your homepage.
                    </p>
                </div>
                <Button
                    onClick={() => {
                        setEditingTestimonial(null);
                        setImagePreview(null);
                        setRating(0);
                        setOpenForm(true);
                    }}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:scale-105 transition-all"
                >
                    <Plus className="w-4 h-4 mr-2" /> Add Testimonial
                </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-gray-50 to-white">
                {loading ? (
                    <Loading message="Loading testimonials..." fullScreen />
                ) : testimonials.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-80 text-center">
                        <ImagePlus className="h-12 w-12 text-gray-400 mb-3" />
                        <h4 className="text-lg font-semibold text-gray-800 mb-2">
                            No testimonials yet
                        </h4>
                        <p className="text-gray-500 text-sm mb-5 max-w-sm">
                            Add client testimonials to build trust.
                        </p>
                        <Button
                            onClick={() => setOpenForm(true)}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md hover:scale-105 transition-all"
                        >
                            <Plus className="mr-2 w-4 h-4" /> Create First Testimonial
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence>
                            {testimonials.map((t, index) => (
                                <motion.div
                                    key={t._id}
                                    initial={{ opacity: 0, y: 40 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                >
                                    <Card className="hover:shadow-2xl transition-all border-gray-100">
                                        <CardHeader className="pb-3 text-center">
                                            <img
                                                src={t.imageUrl}
                                                alt={t.name}
                                                className="w-24 h-24 mx-auto object-cover rounded-full mb-3 border"
                                            />
                                            <CardTitle className="text-lg font-bold text-gray-900">
                                                {t.name}
                                            </CardTitle>
                                            <CardDescription className="text-sm text-gray-500">
                                                {t.role}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="text-center">
                                            <p className="text-gray-600 text-sm mb-2 italic">
                                                “{t.review}”
                                            </p>
                                            <div className="flex justify-center mb-3">
                                                {Array.from({ length: 5 }).map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`h-4 w-4 ${i < t.rating
                                                            ? "text-yellow-500 fill-yellow-500"
                                                            : "text-gray-300"
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                            <div className="flex justify-center gap-2 flex-wrap">
                                                <Button
                                                    size="icon"
                                                    variant="outline"
                                                    className="h-8 w-8 text-blue-600 border-blue-200 hover:bg-blue-100"
                                                    onClick={() => {
                                                        setEditingTestimonial(t);
                                                        setRating(t.rating);
                                                        setImagePreview(t.imageUrl || null);
                                                        setOpenForm(true);
                                                    }}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    size="icon"
                                                    variant="outline"
                                                    className="h-8 w-8 text-red-600 border-red-200 hover:bg-red-100"
                                                    onClick={() => confirmDelete(t)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    size="icon"
                                                    variant="outline"
                                                    className={`h-8 w-8 ${t.isActive
                                                        ? "text-green-600 border-green-200 hover:bg-green-100"
                                                        : "text-gray-500 border-gray-200 hover:bg-gray-100"
                                                        }`}
                                                    onClick={() => handleToggleActive(t)}
                                                >
                                                    {t.isActive ? (
                                                        <Eye className="h-4 w-4" />
                                                    ) : (
                                                        <EyeOff className="h-4 w-4" />
                                                    )}
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            {/* 🔹 Delete Confirmation Popup */}
            <Dialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
                <DialogContent className="max-w-sm text-center">
                    <DialogHeader>
                        <div className="flex justify-center mb-3">
                            <AlertTriangle className="w-10 h-10 text-red-500" />
                        </div>
                        <DialogTitle>Delete Testimonial?</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete{" "}
                            <span className="font-semibold">
                                {deleteTarget?.name}
                            </span>
                            ? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-center gap-3 mt-5">
                        <Button
                            variant="outline"
                            onClick={() => setConfirmDeleteOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleDeleteConfirmed}
                            className="bg-red-600 text-white hover:bg-red-700"
                        >
                            Delete
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* 🔹 Add/Edit Form Dialog */}
            <Dialog open={openForm} onOpenChange={setOpenForm}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {editingTestimonial ? "Edit Testimonial" : "Add New Testimonial"}
                        </DialogTitle>
                        <DialogDescription>
                            {editingTestimonial
                                ? "Update testimonial details below."
                                : "Add a new testimonial from a client or customer."}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-5 mt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-semibold text-gray-700">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    defaultValue={editingTestimonial?.name || ""}
                                    required
                                    className="w-full mt-1 p-2 border rounded-md focus:ring focus:ring-emerald-100"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-semibold text-gray-700">
                                    Role
                                </label>
                                <input
                                    type="text"
                                    name="role"
                                    defaultValue={editingTestimonial?.role || ""}
                                    required
                                    className="w-full mt-1 p-2 border rounded-md focus:ring focus:ring-emerald-100"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-gray-700">
                                Review
                            </label>
                            <textarea
                                name="review"
                                defaultValue={editingTestimonial?.review || ""}
                                rows={3}
                                required
                                className="w-full mt-1 p-2 border rounded-md focus:ring focus:ring-emerald-100"
                            />
                        </div>

                        {/* Star Rating */}
                        <div>
                            <label className="text-sm font-semibold text-gray-700">
                                Rating
                            </label>
                            <div className="flex space-x-2 mt-2">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                        key={i}
                                        onClick={() => setRating(i + 1)}
                                        className={`cursor-pointer h-6 w-6 ${i < rating
                                            ? "text-yellow-500 fill-yellow-500"
                                            : "text-gray-300"
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-gray-700">
                                Image
                            </label>
                            <input
                                type="file"
                                name="image"
                                accept="image/*"
                                className="block w-full mt-1 text-sm border rounded-md p-1"
                                onChange={handleImageChange}
                            />
                            {imagePreview && (
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="mt-2 w-28 h-28 object-cover rounded-md border"
                                />
                            )}
                        </div>

                        <div className="flex justify-end space-x-3 pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setOpenForm(false)}
                            >
                                Cancel
                            </Button>

                            <Button
                                type="submit"
                                disabled={submitting}
                                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md hover:scale-105 transition-all"
                            >
                                {submitting ? (
                                    <div className="flex items-center">
                                        <Loading message="Saving..." />
                                    </div>
                                ) : editingTestimonial ? (
                                    "Update Testimonial"
                                ) : (
                                    "Add Testimonial"
                                )}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default TestimonialSection;
