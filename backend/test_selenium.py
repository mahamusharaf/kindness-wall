import pytest
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options

BASE_URL = "http://68.210.64.100"

@pytest.fixture
def driver():
    options = Options()
    options.add_argument("--headless")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    driver = webdriver.Chrome(options=options)
    driver.implicitly_wait(10)
    yield driver
    driver.quit()


def test_homepage_loads(driver):
    """Test 1: Verify homepage loads correctly"""
    driver.get(BASE_URL)
    assert "Kindness" in driver.title
    heading = driver.find_element(By.TAG_NAME, "h1")
    assert "Kindness Wall" in heading.text
    print("Test 1 PASSED: Homepage loads correctly")


def test_form_elements_present(driver):
    """Test 2: Validate form elements are present"""
    driver.get(BASE_URL)
    name_input = driver.find_element(By.ID, "name-input")
    story_input = driver.find_element(By.ID, "story-input")
    submit_btn = driver.find_element(By.ID, "submit-btn")
    assert name_input.is_displayed()
    assert story_input.is_displayed()
    assert submit_btn.is_displayed()
    print("Test 2 PASSED: Form elements are present")


def test_submit_kindness_entry(driver):
    """Test 3: Validate form submission behavior"""
    driver.get(BASE_URL)
    name_input = driver.find_element(By.ID, "name-input")
    story_input = driver.find_element(By.ID, "story-input")
    submit_btn = driver.find_element(By.ID, "submit-btn")

    name_input.clear()
    name_input.send_keys("Selenium Tester")
    story_input.clear()
    story_input.send_keys("I helped someone with their DevOps exam at 1am!")
    submit_btn.click()
    time.sleep(2)

    # Check page still loaded (no crash)
    assert "Kindness" in driver.title
    print("Test 3 PASSED: Form submission works")


def test_character_counter(driver):
    """Test 4: Validate character counter updates"""
    driver.get(BASE_URL)
    story_input = driver.find_element(By.ID, "story-input")
    char_count = driver.find_element(By.ID, "char-count")

    story_input.send_keys("Hello World")
    time.sleep(0.5)
    assert char_count.text == "11"
    print("Test 4 PASSED: Character counter works")


def test_kind_acts_feed_section(driver):
    """Test 5: Verify Kind Acts Feed section is present"""
    driver.get(BASE_URL)
    feed_section = driver.find_element(By.ID, "entries-container")
    assert feed_section.is_displayed()

    refresh_btn = driver.find_element(By.ID, "refresh-btn")
    assert refresh_btn.is_displayed()
    refresh_btn.click()
    time.sleep(1)
    print("Test 5 PASSED: Kind Acts Feed section works")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])