// loadComponents.js

document.addEventListener("DOMContentLoaded", () => {
  const loadComponent = (url, elementId) => {
    return fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.text();
      })
      .then((data) => {
        const element = document.getElementById(elementId);
        if (element) element.innerHTML = data;
      })
      .catch((error) =>
        console.error(`Could not load component from ${url}:`, error)
      );
  };

  Promise.all([
    loadComponent("header.html", "header-placeholder"),
    loadComponent("footer.html", "footer-placeholder"),
    loadComponent("next-button.html", "next-button-placeholder"),
  ]).then(() => {
    const notificationButton = document.getElementById('notification-button');
    const notificationPanel = document.getElementById('notification-panel');

    if (notificationButton && notificationPanel) {
      // *** 수정된 부분: 알림 상태를 체크하고 UI를 업데이트하는 함수 ***
      const checkNotifications = () => {
        const notificationList = document.getElementById('notification-list');
        const emptyState = document.getElementById('notification-empty-state');
        const notificationFooter = document.getElementById('notification-footer');

        if (!notificationList || !emptyState || !notificationFooter) return;

        // 알림 목록 안에 있는 실제 알림 항목(<a> 태그)의 개수를 셉니다.
        const notificationItemsCount = notificationList.querySelectorAll('a').length;

        if (notificationItemsCount > 0) {
          // 알림이 있으면: 목록과 푸터를 보여주고, '알림 없음' 메시지는 숨깁니다.
          notificationList.classList.remove('hidden');
          notificationFooter.classList.remove('hidden');
          emptyState.classList.add('hidden');
        } else {
          // 알림이 없으면: 목록과 푸터를 숨기고, '알림 없음' 메시지를 보여줍니다.
          notificationList.classList.add('hidden');
          notificationFooter.classList.add('hidden');
          emptyState.classList.remove('hidden');
        }
      };

      // 알림 버튼 클릭 시 패널 토글
      notificationButton.addEventListener('click', (event) => {
        notificationPanel.classList.toggle('hidden');
        // 패널이 열릴 때마다 알림 상태를 다시 체크합니다.
        if (!notificationPanel.classList.contains('hidden')) {
          checkNotifications();
        }
        event.stopPropagation();
      });

      // 외부 클릭 시 패널 닫기
      document.addEventListener('click', (event) => {
        if (!notificationPanel.classList.contains('hidden') && !notificationPanel.contains(event.target) && !notificationButton.contains(event.target)) {
          notificationPanel.classList.add('hidden');
        }
      });
    }

    document.dispatchEvent(new Event('componentsLoaded'));
  });
});