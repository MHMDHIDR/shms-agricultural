"use client";

import Confirm from "@/components/custom/confirm";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConfirmDialog } from "@/components/custom/confirm-dialog";
import { API_URL, DEFAULT_DURATION } from "@/data/constants";
import { toast } from "sonner";
import { Error, Success } from "@/components/icons/status";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { FormStatusContext } from "@/providers/form-status";
import type { Users } from "@prisma/client";
import type { FormStatusProps } from "@/types";

export default function UsersActions({ user, id }: { user: Users[]; id: Users["id"] }) {
  const [userStockLimit, setUserStockLimit] = useState<Users["shms_user_stock_limit"]>(1);
  const [filteredUser, setFilteredUser] = useState<Users>();

  const { formStatus, setFormStatus } = useContext<FormStatusProps>(FormStatusContext);

  useEffect(() => {
    if (id) {
      const filtered = user.filter(user => user.id === id);
      setFilteredUser(filtered[0]);
    }
  }, [id, user]);

  const deleteUser = async (id: string, S3docId: string) => {
    try {
      setFormStatus({ ...formStatus, isSubmitting: true });
      const { data }: { data: Users } = await axios.delete(
        `${API_URL}/users/delete/${id}`
      );

      // delete user document from s3 bucket
      const {
        data: { docDeleted },
      }: { data: { docDeleted: boolean } } = await axios.delete(
        decodeURI(`${API_URL}/deleteFromS3/${S3docId}`),
        { data: { imageId: S3docId } }
      );

      // make sure to view the response from the data
      if (data.userDeleted === 1 && docDeleted) {
        toast(data.message ?? "تم حذف حساب المستخدم بنجاح 👍🏼", {
          icon: <Success className="w-6 h-6 ml-3" />,
          position: "bottom-center",
          className: "text-right select-none rtl",
          duration: DEFAULT_DURATION,
          style: {
            backgroundColor: "#F0FAF0",
            color: "#367E18",
            border: "1px solid #367E18",
            gap: "1.5rem",
            textAlign: "justify",
          },
        });
      } else {
        toast("حدث خطأ ما", {
          icon: <Error className="w-6 h-6 ml-3" />,
          position: "bottom-center",
          className: "text-right select-none rtl",
          style: {
            backgroundColor: "#FFF0F0",
            color: "#BE2A2A",
            border: "1px solid #BE2A2A",
            gap: "1.5rem",
            textAlign: "justify",
          },
        });
      }

      setFormStatus({ ...formStatus, isSubmitting: false, isSubmittingDone: true });
    } catch (error) {
      toast("حدث خطأ ما", {
        icon: <Error className="w-6 h-6 ml-3" />,
        position: "bottom-center",
        className: "text-right select-none rtl",
        style: {
          backgroundColor: "#FFF0F0",
          color: "#BE2A2A",
          border: "1px solid #BE2A2A",
          gap: "1.5rem",
          textAlign: "justify",
        },
      });
      console.error("Error =>", error);
    } finally {
      setFormStatus({ ...formStatus, isSubmitting: false, isSubmittingDone: false });
    }
  };

  const toggleUserStatus = async (
    id: string,
    status: Users["shms_user_account_status"]
  ) => {
    try {
      setFormStatus({ ...formStatus, isSubmitting: true });
      const { data }: { data: Users } = await axios.patch(
        `${API_URL}/users/toggleStatus/${id}`,
        { status }
      );

      if (data.userUpdated === 1) {
        toast(data.message ?? "تم تحديث حالة المستخدم بنجاح 👍🏼", {
          icon: <Success className="w-6 h-6 ml-3" />,
          position: "bottom-center",
          className: "text-right select-none rtl",
          duration: DEFAULT_DURATION,
          style: {
            backgroundColor: "#F0FAF0",
            color: "#367E18",
            border: "1px solid #367E18",
            gap: "1.5rem",
            textAlign: "justify",
          },
        });
      } else {
        toast("حدث خطأ ما", {
          icon: <Error className="w-6 h-6 ml-3" />,
          position: "bottom-center",
          className: "text-right select-none rtl",
          style: {
            backgroundColor: "#FFF0F0",
            color: "#BE2A2A",
            border: "1px solid #BE2A2A",
            gap: "1.5rem",
            textAlign: "justify",
          },
        });
      }

      setFormStatus({ ...formStatus, isSubmitting: false, isSubmittingDone: true });
    } catch (error) {
      toast("حدث خطأ ما", {
        icon: <Error className="w-6 h-6 ml-3" />,
        position: "bottom-center",
        className: "text-right select-none rtl",
        style: {
          backgroundColor: "#FFF0F0",
          color: "#BE2A2A",
          border: "1px solid #BE2A2A",
          gap: "1.5rem",
          textAlign: "justify",
        },
      });
      console.error("Error =>", error);
    } finally {
      setFormStatus({ ...formStatus, isSubmitting: false, isSubmittingDone: false });
    }
  };

  const updateUserStockLimitOrBalance = async (
    id: string,
    newValue: number,
    type: string
  ) => {
    try {
      setFormStatus({ ...formStatus, isSubmitting: true });
      const { data }: { data: Users } = await axios.patch(
        `${API_URL}/users/updateStockLimitOrBalance/${id}`,
        { newValue, type }
      );

      if (data.userUpdated === 1) {
        toast(
          data.message ??
            `تم تحديث ${
              type === "stockLimit"
                ? "حد شراء الأسهم"
                : type === "totalBalance"
                ? "الرصيد الكلي"
                : "الرصيد القابل للسحب"
            } بنجاح 👍🏼 .. جاري تحويلك`,
          {
            icon: <Success className="w-6 h-6 ml-3" />,
            position: "bottom-center",
            className: "text-right select-none rtl",
            duration: DEFAULT_DURATION,
            style: {
              backgroundColor: "#F0FAF0",
              color: "#367E18",
              border: "1px solid #367E18",
              gap: "1.5rem",
              textAlign: "justify",
            },
          }
        );
      } else {
        toast("حدث خطأ ما", {
          icon: <Error className="w-6 h-6 ml-3" />,
          position: "bottom-center",
          className: "text-right select-none rtl",
          style: {
            backgroundColor: "#FFF0F0",
            color: "#BE2A2A",
            border: "1px solid #BE2A2A",
            gap: "1.5rem",
            textAlign: "justify",
          },
        });
      }
      setFormStatus({ ...formStatus, isSubmitting: false, isSubmittingDone: true });
    } catch (error) {
      toast("حدث خطأ ما", {
        icon: <Error className="w-6 h-6 ml-3" />,
        position: "bottom-center",
        className: "text-right select-none rtl",
        style: {
          backgroundColor: "#FFF0F0",
          color: "#BE2A2A",
          border: "1px solid #BE2A2A",
          gap: "1.5rem",
          textAlign: "justify",
        },
      });
      console.error("Error =>", error);
    } finally {
      setFormStatus({ ...formStatus, isSubmitting: false, isSubmittingDone: false });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <span className="border py-1.5 px-4 rounded-md hover:bg-gray-100 transition-colors">
          الاجراء
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="flex flex-col gap-y-1.5">
        <Confirm
          variant={"destructive"}
          onClick={async () => {
            await deleteUser(
              filteredUser?.id!,
              filteredUser?.shms_doc?.split("/").pop() ?? ""
            );
          }}
          className="w-full"
          isLoading={formStatus.isSubmitting}
        >
          حذف
        </Confirm>
        <Confirm
          variant={"outline"}
          onClick={async () => {
            await toggleUserStatus(
              filteredUser?.id!,
              filteredUser?.shms_user_account_status === "block"
                ? "active"
                : filteredUser?.shms_user_account_status === "pending"
                ? "active"
                : "block"
            );
          }}
          className="w-full"
        >
          {filteredUser?.shms_user_account_status === "block"
            ? "الغاء الحظر"
            : filteredUser?.shms_user_account_status === "pending"
            ? "تفعيل الحساب"
            : "حظر"}
        </Confirm>
        <ConfirmDialog
          StockLimit={filteredUser?.shms_user_stock_limit ?? 1}
          onClick={async () => {
            await updateUserStockLimitOrBalance(
              filteredUser?.id!,
              userStockLimit!,
              "stockLimit"
            );
          }}
          onChange={e => setUserStockLimit(Number(e.target.value))}
          formStatus={formStatus}
        >
          حد شراء الاسهم
        </ConfirmDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
