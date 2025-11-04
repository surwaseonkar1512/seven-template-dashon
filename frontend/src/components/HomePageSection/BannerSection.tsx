import React, { useEffect, useState } from "react";
import {
    Plus,
    Edit,
    Trash2,
    Eye,
    EyeOff,
    ImagePlus,
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
import { Badge } from "../../components/ui/badge";
import {
    addBanner,
    getBanners,
    updateBanner,
    deleteBanner,
} from "../../../Services/Homepage";
import Loading from "../ui/Loading";

interface Banner {
    _id?: string;
    title: string;
    description: string;
    imageUrl?: string;
    sideImageUrl?: string;
    domainUrl?: string;
    isActive?: boolean;
}

const BannerSection: React.FC<{ userId: any }> = ({ userId }) => {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
    const [openForm, setOpenForm] = useState(false);
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<Banner | null>(null);
    const [mainPreview, setMainPreview] = useState<string | null>(null);
    const [sidePreview, setSidePreview] = useState<string | null>(null);

    // Load banners
    const loadBanners = async () => {
        setLoading(true);
        try {
            const res = await getBanners(userId);
            setBanners(res);
        } catch (err) {
            console.error("Error loading banners:", err);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadBanners();
    }, []);

    // Image change handlers
    const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) setMainPreview(URL.createObjectURL(file));
    };

    const handleSideImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) setSidePreview(URL.createObjectURL(file));
    };

    // Add / Update Banner
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const data = new FormData(form);
        data.append("userId", userId);

        setSubmitting(true);
        try {
            if (editingBanner?._id) {
                await updateBanner(editingBanner._id, data);
            } else {
                await addBanner(data);
            }
            setOpenForm(false);
            setEditingBanner(null);
            setMainPreview(null);
            setSidePreview(null);
            loadBanners();
        } catch (err) {
            console.error("Error saving banner:", err);
        }
        setSubmitting(false);
    };

    // Delete Confirmation Popup
    const handleConfirmDelete = async () => {
        if (!deleteTarget?._id) return;
        setLoading(true);
        try {
            await deleteBanner(deleteTarget._id);
            setConfirmDeleteOpen(false);
            setDeleteTarget(null);
            loadBanners();
        } catch (err) {
            console.error("Error deleting banner:", err);
        }
        setLoading(false);
    };

    // Toggle Active
    const handleToggleActive = async (banner: Banner) => {
        setLoading(true);
        try {
            const data = new FormData();
            data.append("isActive", (!banner.isActive).toString());
            await updateBanner(banner._id!, data);
            loadBanners();
        } catch (err) {
            console.error("Error toggling banner active state:", err);
        }
        setLoading(false);
    };

    return (
        <div className="flex flex-col h-full bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b flex justify-between items-center bg-gradient-to-r from-blue-50 to-purple-50">
                <div>
                    <h3 className="text-2xl font-bold text-gray-800">Banner Management</h3>
                    <p className="text-gray-500 text-sm mt-1">
                        Manage homepage banners with images, descriptions, and visibility.
                    </p>
                </div>
                <Button
                    onClick={() => {
                        setEditingBanner(null);
                        setMainPreview(null);
                        setSidePreview(null);
                        setOpenForm(true);
                    }}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:scale-105 transition-all"
                >
                    <Plus className="w-4 h-4 mr-2" /> Add Banner
                </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-gray-50 to-white">
                {loading ? (
                    <Loading message="Loading banners..." fullScreen />
                ) : banners.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-80 text-center">
                        <ImagePlus className="h-12 w-12 text-gray-400 mb-3" />
                        <h4 className="text-lg font-semibold text-gray-800 mb-2">
                            No banners yet
                        </h4>
                        <p className="text-gray-500 text-sm mb-5 max-w-sm">
                            Start building your homepage banners by adding your first banner.
                        </p>
                        <Button
                            onClick={() => setOpenForm(true)}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md hover:scale-105 transition-all"
                        >
                            <Plus className="mr-2 w-4 h-4" /> Create First Banner
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence>
                            {banners.map((banner, index) => (
                                <motion.div
                                    key={banner._id}
                                    initial={{ opacity: 0, y: 40 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                >
                                    <Card className="relative hover:shadow-2xl transition-all group border-gray-100">
                                        <CardHeader className="pb-3">
                                            <img
                                                src={banner.imageUrl}
                                                alt={banner.title}
                                                className="w-full h-40 object-cover rounded-xl mb-3"
                                            />
                                            <CardTitle className="text-lg font-bold text-gray-900 truncate">
                                                {banner.title}
                                            </CardTitle>
                                            <CardDescription className="text-sm text-gray-500 line-clamp-2">
                                                {banner.description}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="flex justify-between items-center pt-2">
                                            <Badge
                                                className={`${banner.isActive
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-red-100 text-red-800"
                                                    }`}
                                            >
                                                {banner.isActive ? "Active" : "Inactive"}
                                            </Badge>
                                            <div className="flex items-center space-x-2">
                                                <Button
                                                    size="icon"
                                                    variant="outline"
                                                    className="h-8 w-8 text-blue-600 border-blue-200 hover:bg-blue-100"
                                                    onClick={() => {
                                                        setEditingBanner(banner);
                                                        setMainPreview(banner.imageUrl || null);
                                                        setSidePreview(banner.sideImageUrl || null);
                                                        setOpenForm(true);
                                                    }}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    size="icon"
                                                    variant="outline"
                                                    className="h-8 w-8 text-red-600 border-red-200 hover:bg-red-100"
                                                    onClick={() => {
                                                        setDeleteTarget(banner);
                                                        setConfirmDeleteOpen(true);
                                                    }}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    size="icon"
                                                    variant="outline"
                                                    className="h-8 w-8 text-gray-600 border-gray-200 hover:bg-gray-100"
                                                    onClick={() => handleToggleActive(banner)}
                                                >
                                                    {banner.isActive ? (
                                                        <EyeOff className="h-4 w-4" />
                                                    ) : (
                                                        <Eye className="h-4 w-4" />
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

            {/* Confirmation Delete Dialog */}
            <Dialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete{" "}
                            <span className="font-semibold">
                                {deleteTarget?.title}
                            </span>
                            ? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end space-x-3 mt-4">
                        <Button
                            variant="outline"
                            onClick={() => setConfirmDeleteOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleConfirmDelete}
                            className="bg-red-600 text-white hover:bg-red-700"
                        >
                            Delete
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Add/Edit Banner Form */}
            <Dialog open={openForm} onOpenChange={setOpenForm}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>
                            {editingBanner ? "Edit Banner" : "Add New Banner"}
                        </DialogTitle>
                        <DialogDescription>
                            {editingBanner
                                ? "Update banner details or replace images."
                                : "Create a new banner with title, description, and images."}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-5 mt-4">
                        <div>
                            <label className="text-sm font-semibold text-gray-700">
                                Title
                            </label>
                            <input
                                type="text"
                                name="title"
                                defaultValue={editingBanner?.title || ""}
                                required
                                className="w-full mt-1 p-2 border rounded-md focus:ring focus:ring-blue-100"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-gray-700">
                                Description
                            </label>
                            <textarea
                                name="description"
                                defaultValue={editingBanner?.description || ""}
                                rows={3}
                                className="w-full mt-1 p-2 border rounded-md focus:ring focus:ring-blue-100"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-semibold text-gray-700">
                                    Main Image
                                </label>
                                <input
                                    type="file"
                                    name="mainImage"
                                    accept="image/*"
                                    className="block w-full mt-1 text-sm border rounded-md p-1"
                                    onChange={handleMainImageChange}
                                />
                                {mainPreview && (
                                    <img
                                        src={mainPreview}
                                        alt="Main Preview"
                                        className="mt-2 w-full h-40 object-cover rounded-md border"
                                    />
                                )}
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-gray-700">
                                    Side Image
                                </label>
                                <input
                                    type="file"
                                    name="sideImage"
                                    accept="image/*"
                                    className="block w-full mt-1 text-sm border rounded-md p-1"
                                    onChange={handleSideImageChange}
                                />
                                {sidePreview && (
                                    <img
                                        src={sidePreview}
                                        alt="Side Preview"
                                        className="mt-2 w-full h-40 object-cover rounded-md border"
                                    />
                                )}
                            </div>
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
                                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                            >
                                {submitting ? (
                                    <div className="flex items-center">
                                        <Loading message="Saving..." />
                                    </div>
                                ) : editingBanner ? (
                                    "Update Banner"
                                ) : (
                                    "Add Banner"
                                )}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default BannerSection;
