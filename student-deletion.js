<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <title>Student Deletion</title>

    <link
        rel="stylesheet"
        href="admin.css?v=21"
    >

    <style>

        /* =====================================================
           PAGE
        ===================================================== */

        .deletion-page {

            padding: 30px;

        }


        .deletion-header {

            background: white;

            border-radius: 18px;

            padding: 26px 30px;

            margin-bottom: 24px;

            border: 1px solid #e2e8f0;

        }


        .deletion-header h1 {

            margin: 0 0 7px;

            font-size: 28px;

        }


        .deletion-header p {

            margin: 0;

            color: #64748b;

        }


        /* =====================================================
           PASSWORD
        ===================================================== */

        .password-box {

            max-width: 500px;

            margin: 70px auto;

            background: white;

            padding: 35px;

            border-radius: 20px;

            border: 1px solid #e2e8f0;

            box-shadow:
                0 20px 50px
                rgba(15,23,42,.10);

            text-align: center;

        }


        .password-icon {

            font-size: 48px;

            margin-bottom: 15px;

        }


        .password-box h2 {

            margin: 0 0 8px;

        }


        .password-box p {

            color: #64748b;

            margin-bottom: 25px;

        }


        .password-box input {

            width: 100%;

            box-sizing: border-box;

            padding: 13px 15px;

            border: 1px solid #cbd5e1;

            border-radius: 10px;

            outline: none;

            font-size: 15px;

            margin-bottom: 12px;

        }


        .password-box input:focus {

            border-color: #7c3aed;

        }


        .unlock-btn {

            width: 100%;

            padding: 13px;

            border: none;

            border-radius: 10px;

            background: #7c3aed;

            color: white;

            font-weight: 700;

            cursor: pointer;

        }


        .password-error {

            color: #dc2626;

            font-size: 13px;

            min-height: 20px;

            margin-bottom: 8px;

        }


        /* =====================================================
           REPORT GRID
        ===================================================== */

        .series-grid {

            display: grid;

            grid-template-columns:
                repeat(
                    auto-fit,
                    minmax(
                        210px,
                        1fr
                    )
                );

            gap: 18px;

            margin-bottom: 28px;

        }


        .series-card {

            background: white;

            border: 1px solid #e2e8f0;

            border-radius: 18px;

            padding: 22px;

        }


        .series-card h3 {

            margin: 0 0 8px;

            font-size: 18px;

        }


        .series-count {

            font-size: 34px;

            font-weight: 800;

            margin: 8px 0 18px;

        }


        .series-label {

            color: #64748b;

            font-size: 12px;

            text-transform: uppercase;

            letter-spacing: .05em;

        }


        .delete-series-btn {

            width: 100%;

            border: 1px solid #fecaca;

            background: #fff1f2;

            color: #dc2626;

            padding: 10px;

            border-radius: 9px;

            font-weight: 700;

            cursor: pointer;

        }


        .delete-series-btn:hover {

            background: #fee2e2;

        }


        /* =====================================================
           NIC CARD
        ===================================================== */

        .nic-card {

            background:
                linear-gradient(
                    135deg,
                    #7c3aed,
                    #5b21b6
                );

            color: white;

        }


        .nic-card .series-label {

            color: rgba(
                255,
                255,
                255,
                .75
            );

        }


        .nic-card .series-count {

            color: white;

        }


        /* =====================================================
           INDIVIDUAL DELETE
        ===================================================== */

        .individual-section {

            background: white;

            border-radius: 18px;

            border: 1px solid #e2e8f0;

            padding: 25px;

        }


        .individual-section h2 {

            margin-top: 0;

        }


        .individual-section > p {

            color: #64748b;

        }


        .search-row {

            display: flex;

            gap: 10px;

            margin: 20px 0;

        }


        .search-row input {

            flex: 1;

            padding: 13px 15px;

            border: 1px solid #cbd5e1;

            border-radius: 10px;

            outline: none;

        }


        .refresh-btn {

            padding: 12px 18px;

            border: 1px solid #cbd5e1;

            background: white;

            border-radius: 10px;

            cursor: pointer;

        }


        /* =====================================================
           TABLE
        ===================================================== */

        .table-wrapper {

            overflow-x: auto;

        }


        .student-table {

            width: 100%;

            border-collapse: collapse;

        }


        .student-table th {

            text-align: left;

            padding: 13px;

            background: #f8fafc;

            color: #64748b;

            font-size: 12px;

        }


        .student-table td {

            padding: 13px;

            border-top: 1px solid #eef2f7;

            font-size: 14px;

        }


        .student-id {

            font-weight: 700;

            color: #4f46e5;

        }


        .badge {

            display: inline-block;

            padding: 5px 9px;

            border-radius: 7px;

            font-size: 11px;

            font-weight: 700;

        }


        .badge-al {

            background: #ede9fe;

            color: #6d28d9;

        }


        .badge-grade10 {

            background: #dbeafe;

            color: #1d4ed8;

        }


        .badge-grade11 {

            background: #dcfce7;

            color: #15803d;

        }


        .individual-delete {

            border: 1px solid #fecaca;

            background: white;

            color: #dc2626;

            padding: 7px 12px;

            border-radius: 8px;

            cursor: pointer;

            font-weight: 700;

        }


        .empty-row {

            text-align: center;

            color: #64748b;

            padding: 35px !important;

        }


        /* =====================================================
           MOBILE
        ===================================================== */

        @media (
            max-width: 700px
        ) {

            .deletion-page {

                padding: 15px;

            }


            .search-row {

                flex-direction: column;

            }

        }

    </style>

</head>


<body>


<div class="admin-layout">


    <!-- =====================================================
         SIDEBAR
    ===================================================== -->

    <aside class="sidebar">


        <div class="sidebar-brand">

            <div class="brand-logo">
                🎓
            </div>

            <div>

                <h2>
                    Student
                </h2>

                <span>
                    Assessment Portal
                </span>

            </div>

        </div>


        <div class="sidebar-label">
            ADMINISTRATION
        </div>


        <nav class="sidebar-nav">


            <a
                href="admin.html"
                class="nav-item"
            >
                <span class="nav-icon">
                    🏠
                </span>

                Dashboard
            </a>


            <a
                href="students.html"
                class="nav-item"
            >
                <span class="nav-icon">
                    👥
                </span>

                Students
            </a>


            <a
                href="paper-management.html"
                class="nav-item superadmin-only"
            >
                <span class="nav-icon">
                    📚
                </span>

                Paper Management
            </a>


            <a
                href="import-students.html"
                class="nav-item superadmin-only"
            >
                <span class="nav-icon">
                    📥
                </span>

                Import Students
            </a>


            <a
                href="reports.html"
                class="nav-item superadmin-only"
            >
                <span class="nav-icon">
                    📈
                </span>

                Reports
            </a>


            <!-- =============================================
                 STUDENT DELETION
            ============================================== -->

            <a
                href="student-deletion.html"
                class="nav-item active superadmin-only"
            >

                <span class="nav-icon">
                    🗑️
                </span>

                Student Deletion

            </a>


        </nav>


        <div class="sidebar-bottom">

            <div class="admin-user-card">

                <div class="admin-user-icon">
                    👨‍💼
                </div>

                <div class="admin-user-info">

                    <strong id="adminUsername">
                        Super Admin
                    </strong>

                    <span id="adminRole">
                        Super Administrator
                    </span>

                </div>

            </div>


            <button
                type="button"
                id="logoutBtn"
                class="logout-btn"
            >

                🚪

                <span>
                    Sign Out
                </span>

            </button>

        </div>

    </aside>


    <!-- =====================================================
         MAIN
    ===================================================== -->

    <main class="main-content">


        <!-- =================================================
             PASSWORD SCREEN
        ================================================= -->

        <section
            id="passwordCard"
            class="password-box"
        >

            <div class="password-icon">
                🔐
            </div>

            <h2>
                Student Deletion
            </h2>

            <p>
                Super Administrator access required.
            </p>


            <input
                type="password"
                id="deletePassword"
                placeholder="Enter deletion password"
                autocomplete="off"
            >


            <div
                id="passwordError"
                class="password-error"
            ></div>


            <button
                type="button"
                id="unlockBtn"
                class="unlock-btn"
            >
                🔓 Continue
            </button>

        </section>


        <!-- =================================================
             REPORT
        ================================================= -->

        <section
            id="reportPanel"
            class="deletion-page"
            style="display:none;"
        >


            <div class="deletion-header">

                <h1>
                    Student Deletion
                </h1>

                <p>
                    Delete students individually or
                    by admission series.
                </p>

            </div>


            <!-- =============================================
                 SERIES TOTALS
            ============================================== -->

            <div class="series-grid">


                <!-- A27000 -->

                <div class="series-card">

                    <div class="series-label">
                        A/L SERIES
                    </div>

                    <h3>
                        A27000
                    </h3>

                    <div
                        class="series-count"
                        id="totalA27000"
                    >
                        0
                    </div>

                    <button
                        type="button"
                        class="delete-series-btn"
                        data-series="A27000"
                    >
                        🗑 Delete All A27000
                    </button>

                </div>


                <!-- A28000 -->

                <div class="series-card">

                    <div class="series-label">
                        A/L SERIES
                    </div>

                    <h3>
                        A28000
                    </h3>

                    <div
                        class="series-count"
                        id="totalA28000"
                    >
                        0
                    </div>

                    <button
                        type="button"
                        class="delete-series-btn"
                        data-series="A28000"
                    >
                        🗑 Delete All A28000
                    </button>

                </div>


                <!-- A29000 -->

                <div class="series-card">

                    <div class="series-label">
                        A/L SERIES
                    </div>

                    <h3>
                        A29000
                    </h3>

                    <div
                        class="series-count"
                        id="totalA29000"
                    >
                        0
                    </div>

                    <button
                        type="button"
                        class="delete-series-btn"
                        data-series="A29000"
                    >
                        🗑 Delete All A29000
                    </button>

                </div>


                <!-- 26000 -->

                <div class="series-card">

                    <div class="series-label">
                        GRADE 11 SERIES
                    </div>

                    <h3>
                        26000
                    </h3>

                    <div
                        class="series-count"
                        id="total26000"
                    >
                        0
                    </div>

                    <button
                        type="button"
                        class="delete-series-btn"
                        data-series="26000"
                    >
                        🗑 Delete All 26000
                    </button>

                </div>


                <!-- 27000 -->

                <div class="series-card">

                    <div class="series-label">
                        GRADE 10 SERIES
                    </div>

                    <h3>
                        27000
                    </h3>

                    <div
                        class="series-count"
                        id="total27000"
                    >
                        0
                    </div>

                    <button
                        type="button"
                        class="delete-series-btn"
                        data-series="27000"
                    >
                        🗑 Delete All 27000
                    </button>

                </div>


                <!-- NIC TOTAL -->

                <div class="series-card nic-card">

                    <div class="series-label">
                        REGISTRATION
                    </div>

                    <h3>
                        NIC Students
                    </h3>

                    <div
                        class="series-count"
                        id="nicStudentTotal"
                    >
                        0
                    </div>

                    <div class="series-label">
                        Students with NIC Number
                    </div>

                </div>


            </div>


            <!-- =============================================
                 INDIVIDUAL
            ============================================== -->

            <section
                class="individual-section"
            >

                <h2>
                    Individual Student Deletion
                </h2>

                <p>
                    Search by Student ID, name or NIC
                    and delete one student account.
                </p>


                <div class="search-row">

                    <input
                        type="text"
                        id="searchInput"
                        placeholder="Search Student ID, Name or NIC..."
                        autocomplete="off"
                    >


                    <button
                        type="button"
                        id="refreshBtn"
                        class="refresh-btn"
                    >
                        🔄 Refresh
                    </button>

                </div>


                <div class="table-wrapper">

                    <table
                        class="student-table"
                    >

                        <thead>

                            <tr>

                                <th>
                                    #
                                </th>

                                <th>
                                    Student ID
                                </th>

                                <th>
                                    Student
                                </th>

                                <th>
                                    Category
                                </th>

                                <th>
                                    Series
                                </th>

                                <th>
                                    Action
                                </th>

                            </tr>

                        </thead>


                        <tbody
                            id="studentTable"
                        >

                            <tr>

                                <td
                                    colspan="6"
                                    class="empty-row"
                                >
                                    Loading...
                                </td>

                            </tr>

                        </tbody>

                    </table>

                </div>

            </section>


        </section>


    </main>

</div>


<script
    type="module"
    src="student-deletion.js?v=1"
></script>


</body>

</html>
