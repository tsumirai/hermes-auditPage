// 每页显示的数据数量
const pageSize = 10;

// 当前页码
let currentActivityPage = 1;
let currentClubPage = 1;
let currentResultPage = 1;

// 总数据量（假设在服务端获取）
let totalActivityCount = 0; // 这里需要根据实际情况设置
let totalClubCount = 0; 
let totalResultCount = 0;

let activityIdMap = {};
let rejectActivityIndex = 0;

let clubIdMap = {};
let rejectClubIndex = 0;

let resultIdMap = {};
let rejectResultIndex = 0;

let rejectType = 0;

// 模拟从服务端获取帖子数据的函数，根据帖子类型筛选
function fetchActivityData(pageNo) {
    currentActivityPage = pageNo
    const postType = document.getElementById("postType").value;
    const activityIdInput = document.getElementById("activityId");
    const activityId = activityIdInput.value.trim();

    // 检查输入是否为数字
    if (!isNaN(activityId)) {
        // 在这里向服务端发送带有活动ID的请求
        // 例如：fetch(`/api/getActivityById?id=${activityId}`)
        // 处理服务端返回的数据并显示在页面上
    } else {
        alert("请输入有效的活动ID");
    }
    
    // 发送GET请求到服务端以获取查询数据
    fetch(`http://124.220.84.200:5455/platform/queryActivity?page_no=${pageNo}&page_size=${pageSize}&audit_type=${postType}&activity_id=${activityId}`)
        .then(response => response.json())
        .then(data => {
            // 渲染获取的数据
            console.log(data)
            renderPostData(data);
        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });
}


// 渲染帖子数据到表格
function renderPostData(activityData) {
    const postTableBody = document.getElementById("postTableBody");
  
    // 清空表格内容
    postTableBody.innerHTML = "";

    activityData.data.activity_datas.forEach((post, index) => {
        const row = document.createElement("tr");

        activityIdMap[index] = post.activity_id
   
        row.innerHTML = `
            <td>${post.activity_id}
            <td>${post.title}</td>
            <td>${post.content}</td>
            <td>${post.cover_image_url && post.cover_image_url != "" ? `<img src="${post.cover_image_url}" alt="活动封面图片" width="100"` : ''}</td>
            <td>${generateImageTags(post.image_urls)}</td>
            <td>${post.author_uid}</td>
            <td>${post.activity_location}</td>
            <td>${post.status}</td>
            <td>${post.audit_status}</td>
            <td>${post.audit_reason}</td>
            <td>
                <button onclick="approvePost(${index})">通过审核</button>
                <button onclick="rejectPost(${index})">驳回</button>
            </td>
        `;
        postTableBody.appendChild(row);
    });

    totalActivityCount = activityData.data.activity_num
    updateActivityPageInfo();
}


// 辅助函数，生成多张图片的HTML标签
function generateImageTags(imageUrls) {
    if (Array.isArray(imageUrls) && imageUrls.length > 0) {
        const imageTags = imageUrls.map(imageUrl => {
            if (imageUrl !== "") {
                return `<img src="${imageUrl}" alt="活动图片" width="100">`;
            } else {
                return ''; // 不展示空字符串
            }
        });
        return imageTags.join('');
    }
    return '';
}

// 处理通过审核操作
function approvePost(activityIndex) {
    // 在这里执行通过审核操作，可以向服务端发送请求
    let activityId = activityIdMap[activityIndex]

    // 发送POST请求到服务端以获取查询数据
    fetch(`http://124.220.84.200:5455/platform/auditData`,{
        method: 'post',
        headers: {
            'Content-Type':'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
            "data_ids":[String(activityId)],
            "data_type":0,
            "audit_status":1,
        })
    })
        .then(response => response.json())
        .then(data => {
            // 渲染获取的数据
            console.log(data)
            fetchActivityData(currentActivityPage);
            alert("帖子已通过审核");
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            alert("审核出错");
        });
}


// 当用户点击驳回按钮时，弹出驳回原因选择模态框
function rejectPost(index) {
    rejectActivityIndex = index;
    rejectType = 0;
    openRejectionModal();
}


// 处理通过审核操作
function approveClub(clubIndex) {
    // 在这里执行通过审核操作，可以向服务端发送请求
    let clubId = clubIdMap[clubIndex]

    // 发送POST请求到服务端以获取查询数据
    fetch(`http://124.220.84.200:5455/platform/auditData`,{
        method: 'post',
        headers: {
            'Content-Type':'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
            "data_ids":[String(clubId)],
            "data_type":1,
            "audit_status":1,
        })
    })
        .then(response => response.json())
        .then(data => {
            // 渲染获取的数据
            console.log(data)
            fetchClubData(currentClubPage);
            alert("社团已通过审核");
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            alert("审核出错");
        });
}


// 当用户点击驳回按钮时，弹出驳回原因选择模态框
function rejectClub(index) {
    rejectClubIndex = index;
    rejectType = 1;
    openRejectionModal();
}

// 在下拉菜单选择发生变化时重新获取和渲染帖子数据
function fetchAndRenderPostData() {
    const postType = document.getElementById("postType").value;
    renderPostData(postType);
}


function fetchClubData(pageNo) {
    currentClubPage = pageNo
    const clubType = document.getElementById("communityType").value;
    const clubIdInput = document.getElementById("clubId");
    const clubId = clubIdInput.value.trim();

    // 检查输入是否为数字
    if (!isNaN(clubId)) {
        // 在这里向服务端发送带有社团ID的请求
        // 例如：fetch(`/api/getActivityById?id=${activityId}`)
        // 处理服务端返回的数据并显示在页面上
    } else {
        alert("请输入有效的活动ID");
    }

    // 发送GET请求到服务端以获取查询数据
    fetch(`http://124.220.84.200:5455/platform/queryClub?page_no=${pageNo}&page_size=${pageSize}&audit_type=${clubType}&club_id=${clubId}`)
        .then(response => response.json())
        .then(data => {
            // 渲染获取的数据
            console.log(data)
            renderCommunityData(data);
        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });
}

// 渲染社团数据到表格
function renderCommunityData(clubData) {
    
    const clubTableBody = document.getElementById("communityTableBody");
  
    // 清空表格内容
    clubTableBody.innerHTML = "";

    clubData.data.club_datas.forEach((club, index) => {
        const row = document.createElement("tr");

        clubIdMap[index] = club.club_id
   
        row.innerHTML = `
            <td>${club.club_id}
            <td>${club.club_name}</td>
            <td>${club.club_icon && club.club_icon != "" ? `<img src="${club.club_icon}" alt="活动封面图片" width="100"` : ''}</td>
            <td>${club.club_back_img && club.club_back_img != "" ? `<img src="${club.club_back_img}" alt="活动背景图片" width="100"` : ''}</td>
            <td>${club.club_summary}</td> 
            <td>${club.creator_uid}</td>
            <td>${club.location_desc}</td>
            <td>${club.club_status}</td>
            <td>${club.audit_status}</td>
            <td>${club.audit_reason}</td>
            <td>
                <button onclick="approveClub(${index})">通过审核</button>
                <button onclick="rejectClub(${index})">驳回</button>
            </td>
        `;
        clubTableBody.appendChild(row);
    });

    totalClubCount = clubData.data.club_num
    console.log(totalClubCount)
    updateClubPageInfo();
}


// 模拟从服务端获取活动成果数据的函数，根据成果类型筛选
function fetchActivityResultData(pageNo) {
    currentResultPage = pageNo
    const postType = document.getElementById("resultType").value;
    const resultIdInput = document.getElementById("resultId");
    const resultId = resultIdInput.value.trim();

    // 检查输入是否为数字
    if (!isNaN(resultId)) {
        // 在这里向服务端发送带有活动ID的请求
        // 例如：fetch(`/api/getActivityById?id=${activityId}`)
        // 处理服务端返回的数据并显示在页面上
    } else {
        alert("请输入有效的活动成果ID");
    }
    
    // 发送GET请求到服务端以获取查询数据
    fetch(`http://124.220.84.200:5455/platform/queryActivityResult?page_no=${pageNo}&page_size=${pageSize}&audit_type=${postType}&activity_id=${resultId}`)
        .then(response => response.json())
        .then(data => {
            // 渲染获取的数据
            console.log(data)
            renderActivityResultData(data);
        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });
}


// 渲染活动成果数据到表格
function renderActivityResultData(resultData) {
    const resultTableBody = document.getElementById("resultTableBody");
  
    // 清空表格内容
    resultTableBody.innerHTML = "";

    resultData.data.result_datas.forEach((post, index) => {
        const row = document.createElement("tr");

        resultIdMap[index] = post.result_id
   
        row.innerHTML = `
            <td>${post.result_id}
            <td>${post.activity_id}</td>
            <td>${post.context}</td>
            <td>${generateImageTags(post.img_urls)}</td>
            <td>${post.author_uid}</td>
            <td>${post.status}</td>
            <td>${post.audit_status}</td>
            <td>${post.audit_reason}</td>
            <td>
                <button onclick="approveActivityResult(${index})">通过审核</button>
                <button onclick="rejectActivityResult(${index})">驳回</button>
            </td>
        `;
        resultTableBody.appendChild(row);
    });

    totalResultCount = resultData.data.activity_result_num
    updateActivityResultPageInfo();
}


// 处理通过审核操作
function approveActivityResult(resultIndex) {
    // 在这里执行通过审核操作，可以向服务端发送请求
    let resultId = resultIdMap[resultIndex]

    // 发送POST请求到服务端以获取查询数据
    fetch(`http://124.220.84.200:5455/platform/auditData`,{
        method: 'post',
        headers: {
            'Content-Type':'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
            "data_ids":[String(resultId)],
            "data_type":2,
            "audit_status":1,
        })
    })
        .then(response => response.json())
        .then(data => {
            // 渲染获取的数据
            console.log(data)
            fetchActivityResultData(currentResultPage);
            alert("帖子已通过审核");
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            alert("审核出错");
        });
}


// 当用户点击驳回按钮时，弹出驳回原因选择模态框
function rejectActivityResult(index) {
    rejectResultIndex = index;
    rejectType = 0;
    openRejectionModal();
}



// 辅助函数，生成多张图片的HTML标签
function generateImageTags(imageUrls) {
    if (Array.isArray(imageUrls) && imageUrls.length > 0) {
        const imageTags = imageUrls.map(imageUrl => {
            if (imageUrl !== "") {
                return `<img src="${imageUrl}" alt="活动图片" width="100">`;
            } else {
                return ''; // 不展示空字符串
            }
        });
        return imageTags.join('');
    }
    return '';
}

// 处理通过审核操作
function approvePost(activityIndex) {
    // 在这里执行通过审核操作，可以向服务端发送请求
    let activityId = activityIdMap[activityIndex]

    // 发送POST请求到服务端以获取查询数据
    fetch(`http://124.220.84.200:5455/platform/auditData`,{
        method: 'post',
        headers: {
            'Content-Type':'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
            "data_ids":[String(activityId)],
            "data_type":0,
            "audit_status":1,
        })
    })
        .then(response => response.json())
        .then(data => {
            // 渲染获取的数据
            console.log(data)
            fetchActivityData(currentActivityPage);
            alert("帖子已通过审核");
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            alert("审核出错");
        });
}


// 当用户点击驳回按钮时，弹出驳回原因选择模态框
function rejectPost(index) {
    rejectActivityIndex = index;
    rejectType = 0;
    openRejectionModal();
}



// 分页按钮和信息元素
const prevButton = document.querySelector("#postTab .pagination button:first-child");
const nextButton = document.querySelector("#postTab .pagination button:last-child");
const pageInfo = document.querySelector("#postTab #pageInfo");

// 上一页按钮点击事件处理函数
function prevActivityPage() {
    if (currentActivityPage > 1) {
        currentActivityPage--;
        //fetchAndRenderPostData();
        fetchActivityData(currentActivityPage);
    }
}

// 下一页按钮点击事件处理函数
function nextActivityPage() {
    const totalPages = Math.ceil(totalActivityCount / pageSize);
    if (currentActivityPage < totalPages) {
        currentActivityPage++;
        //fetchAndRenderPostData();
        fetchActivityData(currentActivityPage);
    }
}

// 上一页按钮点击事件处理函数
function prevClubPage() {
    if (currentClubPage > 1) {
        currentClubPage--;
        //fetchAndRenderPostData();
        fetchClubData(currentClubPage);
    }
}

// 下一页按钮点击事件处理函数
function nextClubPage() {
    const totalPages = Math.ceil(totalClubCount / pageSize);
    if (currentClubPage < totalPages) {
        currentClubPage++;
        //fetchAndRenderPostData();
        fetchClubData(currentClubPage);
    }
}

// 上一页按钮点击事件处理函数
function prevActivityResultPage() {
    if (currentResultPage > 1) {
        currentResultPage--;
        //fetchAndRenderPostData();
        fetchActivityResultData(currentResultPage);
    }
}

// 下一页按钮点击事件处理函数
function nextActivityResultPage() {
    const totalPages = Math.ceil(totalResultCount / pageSize);
    if (currentResultPage < totalPages) {
        currentResultPage++;
        //fetchAndRenderPostData();
        fetchActivityResultData(currentResultPage);
    }
}


// 更新分页信息
function updateActivityPageInfo() {
    const totalPages = Math.ceil(totalActivityCount / pageSize);
    document.getElementById("pageActivityInfo").innerText=`Page ${currentActivityPage} of ${totalPages}`
}

// 更新分页信息
function updateClubPageInfo() {
    const totalPages = Math.ceil(totalClubCount / pageSize);
    document.getElementById("pageClubInfo").innerText=`Page ${currentClubPage} of ${totalPages}`
}

// 更新分页信息
function updateActivityResultPageInfo() {
    const totalPages = Math.ceil(totalResultCount / pageSize);
    document.getElementById("pageActivityResultInfo").innerText=`Page ${currentResultPage} of ${totalPages}`
}

// 在下拉菜单选择发生变化时重新获取和渲染帖子数据
function fetchAndRenderPostData() {
    // 计算起始索引
    const startIndex = (currentActivityPage - 1) * pageSize;
    // 在这里可以向服务端发送请求，获取帖子数据的子集（startIndex 到 startIndex + pageSize）
    // 并渲染到相应的内容容器（例如：#postContent）
    // 更新分页信息
    updatePageInfo();
}


// 页面加载后渲染默认帖子数据
window.onload = function () {
    openTab(event, 'postTab');
    rejectType = 0;
};


// 切换标签页的函数
function openTab(evt, tabName) {
    const tabcontent = document.getElementsByClassName("tabcontent");
    for (let i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    const tablinks = document.getElementsByClassName("tablinks");
    for (let i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("selected"); // 移除之前选中的标签的样式
    }

    const selectedTab = document.getElementById(tabName);
    if (tabName == 'postTab') {
        rejectType = 0
    } else if (tabName == 'communityTab') {
        rejectType = 1
    } if (tabName == 'activityResultTab') {
        rejectType = 2
    }
    
    if (selectedTab) {
        selectedTab.style.display = "block";
        if (evt.currentTarget && evt.currentTarget.classList) {
            evt.currentTarget.classList.add("selected"); // 添加选中标签的样式
        }
    }
};

// 弹出模态框
function openRejectionModal() {
    const modal = document.getElementById("rejectModal");
    modal.style.display = "block";
    resetRejectionReasonForm();
}

// 关闭模态框
function closeRejectionModal() {
    const modal = document.getElementById("rejectModal");
    modal.style.display = "none";
}

// 重置驳回原因选择表单
function resetRejectionReasonForm() {
    const form = document.getElementById("rejectionReasonForm");
    form.reset();
}


// 当用户点击提交按钮时，向服务端发送请求，并关闭模态框
function rejectAudit() {
    const selectedReason = document.querySelector('input[name="rejectionReason"]:checked');
    if (selectedReason) {
        const reasonValue = selectedReason.value;
        // 在这里向服务端发送请求，使用 reasonValue 作为驳回原因
         // 在这里执行通过审核操作，可以向服务端发送请求

        if (rejectType == 0) {
            let activityId = activityIdMap[rejectActivityIndex]
            // 发送POST请求到服务端以获取查询数据
            fetch(`http://124.220.84.200:5455/platform/auditData`,{
                method: 'post',
                headers: {
                    'Content-Type':'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({
                    "data_ids":[String(activityId)],
                    "data_type":0,
                    "audit_status":-1,
                    "audit_reason":reasonValue
                })
            })
                .then(response => response.json())
                .then(data => {
                    // 渲染获取的数据
                    console.log(data)
                    alert("社团已驳回");
                    fetchActivityData(currentActivityPage);
                })
                .catch(error => {
                    console.error("Error fetching data:", error);
                    alert("驳回出错");
                });
            console.log("提交驳回原因:", reasonValue);
            closeRejectionModal();
        } else if (rejectType == 1) {
            let clubId = clubIdMap[rejectClubIndex]
            // 发送POST请求到服务端以获取查询数据
            fetch(`http://124.220.84.200:5455/platform/auditData`,{
                method: 'post',
                headers: {
                    'Content-Type':'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({
                    "data_ids":[String(clubId)],
                    "data_type":1,
                    "audit_status":-1,
                    "audit_reason":reasonValue
                })
            })
                .then(response => response.json())
                .then(data => {
                    // 渲染获取的数据
                    console.log(data)
                    alert("社团已驳回");
                    fetchClubData(currentClubPage);
                })
                .catch(error => {
                    console.error("Error fetching data:", error);
                    alert("驳回出错");
                });
            console.log("提交驳回原因:", reasonValue);
            closeRejectionModal();
        } else if (rejectType == 2) {
            let resultId = resultIdMap[rejectResultIndex]
            // 发送POST请求到服务端以获取查询数据
            fetch(`http://124.220.84.200:5455/platform/auditData`,{
                method: 'post',
                headers: {
                    'Content-Type':'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({
                    "data_ids":[String(resultId)],
                    "data_type":2,
                    "audit_status":-1,
                    "audit_reason":reasonValue
                })
            })
                .then(response => response.json())
                .then(data => {
                    // 渲染获取的数据
                    console.log(data)
                    alert("活动成果已驳回");
                    fetchActivityResultData(currentResultPage);
                })
                .catch(error => {
                    console.error("Error fetching data:", error);
                    alert("驳回出错");
                });
            console.log("提交驳回原因:", reasonValue);
            closeRejectionModal();
        }else {
            alert("审核类型错误");
        }

    } else {
        alert("请选择一个驳回原因");
    }
}

// // 当用户点击提交按钮时，向服务端发送请求，并关闭模态框
// document.getElementById("submitRejection").addEventListener("click", function() {
    
// });
