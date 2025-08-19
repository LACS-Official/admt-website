# Recovery模式连接指南

## 概述

Recovery模式是Android设备的恢复环境，是一个独立于主系统的微型Linux系统。Recovery模式主要用于系统恢复、固件刷写、数据清除、系统备份等操作。它是Android设备维护和故障排除的重要工具，分为官方Recovery和第三方自定义Recovery两大类。

## 技术原理

### Recovery系统架构

Recovery模式基于Linux内核，包含以下核心组件：

- **内核**: 精简的Linux内核，支持基本硬件驱动
- **文件系统**: 通常使用ramdisk或小型文件系统
- **用户界面**: 基于framebuffer的简单图形界面
- **工具集**: 包含刷机、备份、恢复等工具
- **脚本引擎**: 支持update-script和updater-script

### Recovery类型

#### 1. 官方Recovery (Stock Recovery)

- **功能有限**: 仅支持官方固件包安装
- **安全性高**: 具有签名验证机制
- **界面简单**: 基本的文本界面
- **操作受限**: 不支持第三方ROM和高级功能

#### 2. 第三方Recovery

**TWRP (Team Win Recovery Project):**
- 触摸屏界面
- 完整的文件管理器
- 高级备份和恢复功能
- 支持多种文件系统

**CWM (ClockworkMod Recovery):**
- 经典的按键操作界面
- 稳定可靠
- 广泛的设备支持
- 简洁的功能设计

## 进入Recovery模式

### 方法一：硬件按键组合

不同设备的按键组合可能不同：

#### 通用方法
1. **完全关机**: 确保设备完全关闭
2. **按键组合**: 同时按住以下组合之一：
   - `音量上 + 电源键` (最常见)
   - `音量上 + 音量下 + 电源键`
   - `音量下 + 电源键` (部分设备)
3. **保持按键**: 持续按住10-15秒
4. **确认进入**: 看到Recovery界面

#### 品牌特定方法

**三星设备:**
```
音量上 + Home键 + 电源键
```

**华为设备:**
```
音量上 + 电源键
```

**小米设备:**
```
音量上 + 电源键
```

**一加设备:**
```
音量下 + 电源键，然后选择Recovery
```

### 方法二：ADB命令

如果设备能正常启动并开启了USB调试：

```bash
# 重启到Recovery模式
adb reboot recovery

# 检查设备连接
adb devices
```

### 方法三：Fastboot命令

如果设备在Fastboot模式：

```bash
# 从Fastboot重启到Recovery
fastboot reboot recovery

# 临时启动Recovery镜像
fastboot boot recovery.img
```

### 方法四：系统应用

某些设备支持通过应用进入Recovery：

1. 安装"重启到Recovery"类应用
2. 获取Root权限
3. 通过应用选择重启到Recovery

## Recovery界面操作

### 官方Recovery操作

#### 1. 基本导航

- **音量上/下**: 移动光标
- **电源键**: 确认选择
- **Home键**: 返回主菜单（部分设备）

#### 2. 主要选项

```
Android Recovery
Use volume up/down and power.

reboot system now          - 重启系统
apply update from ADB       - 从ADB安装更新
apply update from SD card   - 从SD卡安装更新
wipe data/factory reset     - 清除数据/恢复出厂设置
wipe cache partition        - 清除缓存分区
```

### TWRP操作指南

#### 1. 主界面功能

**Install (安装):**
- 刷写ZIP包
- 选择安装位置
- 验证签名选项

**Wipe (清除):**
- 高级清除选项
- 格式化分区
- 修复文件系统

**Backup (备份):**
- 选择备份分区
- 设置备份名称
- 压缩选项

**Restore (恢复):**
- 选择备份文件
- 恢复特定分区
- 验证备份完整性

**Mount (挂载):**
- 挂载系统分区
- USB存储模式
- MTP文件传输

**Settings (设置):**
- 界面设置
- 时区配置
- 语言选择

#### 2. 高级功能

**Terminal (终端):**
```bash
# 进入命令行模式
# 执行Linux命令
ls /system
cat /proc/version
df -h
```

**File Manager (文件管理器):**
- 浏览设备文件系统
- 复制、移动、删除文件
- 修改文件权限
- 编辑文本文件

## 玩机管家Recovery集成

### 自动检测和连接

#### 1. Recovery模式检测

```bash
# 检测Recovery设备
device-manager.exe --detect-recovery

# 输出示例：
# Recovery Device Detected:
# Device: Xiaomi Mi 10
# Recovery: TWRP 3.5.2
# Connection: USB
# Status: Ready
```

#### 2. 设备信息获取

```bash
# 获取Recovery信息
recovery-tool.exe --device-info

# 获取分区布局
recovery-tool.exe --partition-layout

# 检查Recovery版本
recovery-tool.exe --recovery-version
```

### 图形界面操作

#### 1. Recovery管理面板

玩机管家提供专门的Recovery管理界面：

- **设备状态**: 实时显示设备连接状态
- **分区信息**: 显示分区大小和使用情况
- **操作历史**: 记录所有操作和结果
- **快捷操作**: 常用功能的一键执行

#### 2. 文件传输

```bash
# 推送文件到设备
recovery-tool.exe --push firmware.zip /sdcard/

# 从设备拉取文件
recovery-tool.exe --pull /sdcard/backup.zip ./

# 批量文件传输
recovery-tool.exe --sync-folder ./roms/ /sdcard/roms/
```

### 自动化脚本

#### 1. 刷机脚本

```bash
# 自动刷机脚本
recovery-tool.exe --auto-flash \
  --rom rom.zip \
  --gapps gapps.zip \
  --wipe-data \
  --reboot
```

#### 2. 备份脚本

```bash
# 自动备份脚本
recovery-tool.exe --auto-backup \
  --partitions "boot,system,data" \
  --compress \
  --output ./backup/
```

## 常见操作流程

### 刷写自定义ROM

#### 1. 准备工作

```bash
# 检查设备连接
adb devices

# 重启到Recovery
adb reboot recovery

# 验证Recovery版本
# 确保是TWRP或其他第三方Recovery
```

#### 2. 备份当前系统

在TWRP中执行：

1. 点击 **Backup**
2. 选择要备份的分区：
   - **Boot** (引导分区)
   - **System** (系统分区)
   - **Data** (用户数据)
3. 设置备份名称
4. 开始备份

#### 3. 清除数据

1. 点击 **Wipe**
2. 选择 **Advanced Wipe**
3. 选择要清除的分区：
   - **Dalvik/ART Cache**
   - **System**
   - **Data**
   - **Cache**
4. 滑动确认清除

#### 4. 刷写ROM

1. 点击 **Install**
2. 浏览到ROM文件位置
3. 选择ROM ZIP文件
4. 滑动确认刷写
5. 等待刷写完成

#### 5. 刷写GApps（可选）

1. 在刷写完ROM后，不要重启
2. 再次点击 **Install**
3. 选择GApps ZIP文件
4. 滑动确认刷写

#### 6. 重启系统

1. 点击 **Reboot**
2. 选择 **System**
3. 等待系统启动

### 系统备份和恢复

#### 1. 完整系统备份

```bash
# 使用玩机管家进行完整备份
recovery-tool.exe --full-backup \
  --output ./backup/full_backup_$(date +%Y%m%d) \
  --compress \
  --verify
```

#### 2. 选择性备份

在TWRP中：

1. 进入 **Backup** 界面
2. 选择要备份的分区：
   - **Boot**: 内核和ramdisk
   - **Recovery**: Recovery分区
   - **System**: 系统文件
   - **Data**: 应用和用户数据
   - **EFS**: 基带信息（重要）
3. 设置备份选项：
   - 启用压缩
   - 跳过MD5校验（加快速度）
4. 开始备份

#### 3. 系统恢复

1. 进入 **Restore** 界面
2. 选择备份文件
3. 选择要恢复的分区
4. 滑动确认恢复

### 修复系统问题

#### 1. 修复引导问题

```bash
# 重新刷写Boot分区
recovery-tool.exe --flash-partition boot boot.img

# 修复引导循环
recovery-tool.exe --fix-bootloop
```

#### 2. 修复权限问题

在TWRP中：

1. 进入 **Advanced** 菜单
2. 选择 **Fix Permissions**
3. 等待修复完成

#### 3. 修复文件系统

```bash
# 检查文件系统
recovery-tool.exe --check-filesystem /system
recovery-tool.exe --check-filesystem /data

# 修复文件系统错误
recovery-tool.exe --repair-filesystem /data
```

## ADB Sideload功能

### 什么是ADB Sideload

ADB Sideload是一种通过USB连接直接向Recovery传输和安装文件的方法，特别适用于：

- 设备存储空间不足
- SD卡无法使用
- 需要直接从电脑传输大文件

### 使用ADB Sideload

#### 1. 进入Sideload模式

在TWRP中：
1. 点击 **Advanced**
2. 选择 **ADB Sideload**
3. 滑动开始Sideload模式

在官方Recovery中：
1. 选择 **apply update from ADB**

#### 2. 传输文件

```bash
# 检查Sideload连接
adb devices
# 输出应显示: xxxxxxxx sideload

# 传输并安装ZIP文件
adb sideload rom.zip

# 传输大文件
adb sideload large_firmware.zip
```

#### 3. 批量Sideload

```bash
# 批量传输脚本
#!/bin/bash
FILES=("rom.zip" "gapps.zip" "magisk.zip")

for file in "${FILES[@]}"; do
    echo "Sideloading $file..."
    adb sideload "$file"

    # 等待用户确认继续
    read -p "Press Enter to continue with next file..."
done
```

## 故障排除

### 常见问题

#### 1. 无法进入Recovery模式

**可能原因:**
- 按键组合不正确
- Recovery分区损坏
- 硬件故障

**解决方案:**
```bash
# 尝试通过ADB进入
adb reboot recovery

# 通过Fastboot刷写Recovery
fastboot flash recovery recovery.img

# 检查设备特定的进入方法
```

#### 2. Recovery界面显示异常

**可能原因:**
- 显示驱动问题
- Recovery版本不兼容
- 硬件兼容性问题

**解决方案:**
```bash
# 刷写兼容的Recovery版本
fastboot flash recovery compatible_recovery.img

# 尝试不同的Recovery（TWRP/CWM）
```

#### 3. 无法挂载分区

**错误信息:**
```
E: Unable to mount /system
E: Unable to mount /data
```

**解决方案:**
```bash
# 在TWRP中修复文件系统
# Advanced -> File Manager -> 选择分区 -> Repair or Change File System

# 或使用命令行
recovery-tool.exe --repair-filesystem /system
recovery-tool.exe --repair-filesystem /data
```

#### 4. ADB连接问题

**解决方案:**
```bash
# 重启ADB服务
adb kill-server
adb start-server

# 检查驱动安装
device-manager.exe --check-adb-drivers

# 尝试不同的USB端口和数据线
```

### 错误代码参考

| 错误代码 | 描述 | 解决方案 |
|---------|------|----------|
| E:failed to mount | 分区挂载失败 | 检查文件系统，尝试修复 |
| E:signature verification failed | 签名验证失败 | 禁用签名验证或使用正确签名的文件 |
| E:footer is wrong | 文件格式错误 | 重新下载正确的文件 |
| E:installation aborted | 安装中止 | 检查文件完整性和兼容性 |

## 安全注意事项

### 操作风险评估

| 风险等级 | 操作类型 | 风险描述 |
|---------|----------|----------|
| 低 | 备份操作 | 仅读取数据，安全性高 |
| 中 | 缓存清除 | 可能需要重新配置应用 |
| 高 | 数据清除 | 会丢失所有用户数据 |
| 极高 | 系统分区刷写 | 可能导致设备无法启动 |

### 最佳实践

#### 1. 操作前准备

```bash
# 备份重要数据
adb backup -all -f full_backup.ab

# 记录设备信息
recovery-tool.exe --device-info > device_info.txt

# 下载原厂固件作为备用
```

#### 2. 安全操作流程

1. **验证文件**: 检查ROM和文件的MD5/SHA1校验值
2. **完整备份**: 在任何修改前进行完整系统备份
3. **分步操作**: 逐步执行，每步后验证结果
4. **保持连接**: 确保USB连接稳定，电量充足
5. **应急预案**: 准备救砖工具和原厂固件

#### 3. 操作后验证

```bash
# 检查系统启动
# 验证基本功能
# 测试网络连接
# 检查应用运行状态
```

## 高级技巧

### 自定义Recovery脚本

#### 1. Updater-Script语法

```bash
# 挂载分区
mount("ext4", "EMMC", "/dev/block/platform/msm_sdcc.1/by-name/system", "/system");

# 格式化分区
format("ext4", "EMMC", "/dev/block/platform/msm_sdcc.1/by-name/userdata", "0", "/data");

# 提取文件
package_extract_dir("system", "/system");

# 设置权限
set_perm_recursive(0, 0, 0755, 0644, "/system");

# 卸载分区
unmount("/system");
```

#### 2. 自动化Recovery操作

```python
import subprocess
import time

class RecoveryAutomation:
    def __init__(self):
        self.device_connected = False

    def wait_for_recovery(self, timeout=60):
        """等待设备进入Recovery模式"""
        start_time = time.time()
        while time.time() - start_time < timeout:
            result = subprocess.run(['adb', 'devices'],
                                  capture_output=True, text=True)
            if 'recovery' in result.stdout:
                self.device_connected = True
                return True
            time.sleep(2)
        return False

    def auto_flash_rom(self, rom_path, gapps_path=None):
        """自动刷写ROM"""
        if not self.wait_for_recovery():
            raise Exception("Device not in recovery mode")

        # 清除数据
        self.wipe_data()

        # 刷写ROM
        self.sideload_file(rom_path)

        # 刷写GApps（如果提供）
        if gapps_path:
            self.sideload_file(gapps_path)

        # 重启系统
        self.reboot_system()

    def sideload_file(self, file_path):
        """通过Sideload传输文件"""
        cmd = ['adb', 'sideload', file_path]
        result = subprocess.run(cmd, capture_output=True, text=True)
        return result.returncode == 0
```

### Recovery定制开发

#### 1. 编译TWRP

```bash
# 下载TWRP源码
git clone https://github.com/TeamWin/android_bootable_recovery.git twrp

# 配置编译环境
export ALLOW_MISSING_DEPENDENCIES=true
export TW_DEFAULT_LANGUAGE="zh_CN"
export TARGET_RECOVERY_PIXEL_FORMAT="RGBX_8888"

# 编译Recovery
make recoveryimage
```

#### 2. 添加自定义功能

```cpp
// 在recovery/gui/pages.cpp中添加自定义页面
class CustomPage : public Page {
public:
    CustomPage() {
        // 初始化自定义界面元素
    }

    virtual int NotifyTouch(TOUCH_STATE state, int x, int y) {
        // 处理触摸事件
        return 0;
    }
};
```

## 总结

Recovery模式是Android设备管理的重要组成部分，提供了系统级的维护和修复功能。通过本指南，您应该能够：

**掌握的技能:**
- 安全地进入和使用Recovery模式
- 执行系统备份、恢复和刷写操作
- 处理常见的Recovery问题
- 使用高级功能如ADB Sideload

**关键要点:**
- 始终在操作前进行完整备份
- 选择适合设备的Recovery版本
- 验证文件完整性和兼容性
- 保持稳定的连接和充足的电量
- 准备应急恢复方案

Recovery模式虽然功能强大，但也需要谨慎操作。正确使用Recovery可以解决各种系统问题，恢复损坏的设备，但错误的操作也可能导致数据丢失或设备损坏。通过不断学习和实践，您将能够熟练掌握这一重要的设备管理工具。