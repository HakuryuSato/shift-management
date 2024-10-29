// src/components/user/UserHomeAppBar.tsx
"use client";

// ライブラリ
import React from "react";
import {
  AppBar,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

// Store
import { useUserHomeAppBarStore ,UserHomeAppBarView } from "@stores/user/userHomeAppBarSlice";
import { useCustomFullCalendarStore } from "@stores/common/customFullCalendarSlice";
import { useUserCalendarViewStore } from "@stores/user/userCalendarViewSlice";

export function UserHomeAppBar() {
  const {
    userHomeAppBarCurrentView,
    setUserHomeAppBarCurrentView,
    isUserHomeAppBarDrawerOpen,
    openUserHomeAppBarDrawer,
    closeUserHomeAppBarDrawer,
    userHomeAppBarMenuItems,
  } = useUserHomeAppBarStore();

  const { customFullCalendarCurrentMonth } = useCustomFullCalendarStore();
  const { setIsUserCalendarViewVisible } = useUserCalendarViewStore();

  // 現在のビューがHomeかどうかを判定
  const isHomeView = userHomeAppBarCurrentView === "Home";

  // 左のボタン：Homeではハンバーガーメニュー、それ以外では戻るアイコン
  const LeftButtonIcon = isHomeView ? MenuIcon : ArrowBackIcon;

  const handleLeftButtonClick = () => {
    if (isHomeView) {
      openUserHomeAppBarDrawer();
    } else {
      handleChangeView("Home");
    }
  };

  // ビューを切り替える関数
  const handleChangeView = (view: UserHomeAppBarView) => {
    setUserHomeAppBarCurrentView(view);
    setIsUserCalendarViewVisible(view === "Home"); // Home以外では非表示にする
  };

  // 中央のタイトル：Homeでは現在の月、それ以外ではビュー名
  const centerTitle = isHomeView
    ? `${customFullCalendarCurrentMonth + 1}月`
    : userHomeAppBarMenuItems.find((item) =>
        item.id === userHomeAppBarCurrentView
      )?.label || userHomeAppBarCurrentView;

  return (
    <>
      {/* AppBar */}
      <AppBar position="static" sx={{ backgroundColor: "#f0f0f0" }}>
        <Toolbar>
          <IconButton
            edge="start"
            aria-label="menu"
            onClick={handleLeftButtonClick}
            sx={{ color: "black" }}
          >
            <LeftButtonIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, textAlign: "center", color: "black" }}
          >
            {centerTitle}
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Drawer (Hamburger Menu) */}
      <Drawer
        anchor="left"
        open={isUserHomeAppBarDrawerOpen}
        onClose={closeUserHomeAppBarDrawer}
        PaperProps={{
          sx: { width: 240 },
        }}
      >
        <List>
          {/* タイトル部分 */}
          <Typography variant="h6" sx={{ padding: "8px" }}>
            出退勤管理
          </Typography>
          <Divider />

          {/* メニュー項目 */}
          {userHomeAppBarMenuItems.map((item) => (
            <ListItem key={item.id} disablePadding>
              <ListItemButton
                onClick={() => {
                  handleChangeView(item.id); // ビューの切り替え
                  closeUserHomeAppBarDrawer();
                }}
              >
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
}
